/* jshint node: true */
'use strict';

var path      = require('path');
var fs        = require('fs');
var RSVP      = require('rsvp');
var Promise   = RSVP.Promise;
var denodeify = RSVP.denodeify;

var readFile  = denodeify(fs.readFile);
var writeFile = denodeify(fs.writeFile);

var replaceHtmlManifest = require('./lib/utilities/replace-html-manifest');
var DeployPluginBase = require('ember-cli-deploy-plugin');

module.exports = {
  name: 'ember-cli-deploy-html-manifest',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      defaultConfig: {
        distDir: function(context) {
          return context.distDir;
        },
        buildManifestPath(context) {
          var revisionKey = context.revisionData && context.revisionData.revisionKey;

          return `/_rev/${revisionKey}/manifest.appcache`;
        }
      },

      didPrepare(context) {
        var distDir     = this.readConfig('distDir');
        var manifestPath    = this.readConfig('buildManifestPath');
        var htmlPagePath    = path.join(distDir,'index.html');
        
        return readFile(htmlPagePath).then( function(data) {
          return replaceHtmlManifest(data, manifestPath).then( function(html) {
            return writeFile(htmlPagePath, html);
          });
        });
      }
    });

    return new DeployPlugin();
  }
};
