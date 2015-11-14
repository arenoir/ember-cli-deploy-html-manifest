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

  createDeployPlugin(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      defaultConfig: {
        distDir(context) {
          return context.distDir;
        },
        buildManifestPath(context) {
          var revisionKey = context.revisionData && context.revisionData.revisionKey;

          return `/_rev/${revisionKey}/manifest.appcache`;
        }
      },

      didPrepare(context) {
        var distDir      = this.readConfig('distDir');
        var manifestPath = this.readConfig('buildManifestPath');
        var htmlPagePath = path.join(distDir, 'index.html');

        this.log(`Adding manifest attribute to html tag with value of "${manifestPath}".`);
        
        var modifying = new Promise((resolve, reject) => {
          readFile(htmlPagePath).then(
            (data) => {
              replaceHtmlManifest(data, manifestPath).then(
                (html) => {
                  writeFile(htmlPagePath, html).then(resolve, reject);
                },
                reject
              );
            },
            reject
          );
        });

        modifying.then(
          () =>{
            this.log('Successfully added manifest attribute to html tag.', { color: 'green' });
          },
          () =>{
            this.log('Faild to add manifest attribute to html tag.', { color: 'red' });
          }
        )

        return modifying;
      }
    });

    return new DeployPlugin();
  }
};
