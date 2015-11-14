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

        manifestFileName: 'manifest.appcache',

        manifestRoot: function(context) {
          var revisionKey = context.revisionData && context.revisionData.revisionKey;

          return '/_rev/' + revisionKey;
        }
      },

      didPrepare: function(context) {
        var distDir      = this.readConfig('distDir');
        var htmlPagePath = path.join(distDir, 'index.html');
        
        var manifestRoot = this.readConfig('manifestRoot');
        var filename     = this.readConfig('manifestFileName');
        var manifestPath = path.join(manifestRoot, filename);


        this.log('Adding manifest attribute to html tag with value of "' + manifestPath + '".');
        
        var modifying = new Promise(function(resolve, reject) {
          readFile(htmlPagePath).then(
            function(data) {
              replaceHtmlManifest(data, manifestPath).then(
                function(html) {
                  writeFile(htmlPagePath, html).then(resolve, reject);
                },
                reject
              );
            },
            reject
          );
        });

        modifying.then(
          function() {
            this.log('Successfully added manifest attribute to html tag.', { color: 'green' });
          },
          function() {
            this.log('Faild to add manifest attribute to html tag.', { color: 'red' });
          }
        )

        return modifying;
      }
    });

    return new DeployPlugin();
  }
};
