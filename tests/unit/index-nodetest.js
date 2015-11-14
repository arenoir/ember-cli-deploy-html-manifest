'use strict';

var fs     = require('node-fs');
var path   = require('path');
var assert = require('ember-cli/tests/helpers/assert');
var cheerio = require('cheerio');

function mkdir(path) {
  try {
    fs.mkdirSync(path, "0777", true);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

function cp(src, dest) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}


describe('the deploy plugin object', function() {
  var fixtureRoot;
  var distDir;
  var plugin;
  var promise;
  var indexPage;
  var fixturePage;

  before(function() {
    fixtureRoot = process.cwd() + '/tests/fixtures/dist'
    distDir = process.cwd() + '/tmp/deploy-dist';
    indexPage = distDir + '/index.html';
    fixturePage = fixtureRoot + '/index.html';
    mkdir(distDir);
  });

  beforeEach(function() {
    var subject = require('../../index');
    
    cp(fixturePage, indexPage);

    plugin = subject.createDeployPlugin({
      name: 'html-manifest'
    });

    var context = {
      ui: {write: function() {}, writeLine: function() {}},
      config: {
        'html-manifest': {
          distDir: function(context) {
            return distDir;
          }
        }
      },
      revisionData: {
        revisionKey: 'ccc'
      }
    };

    plugin.beforeHook(context);
    plugin.configure(context);

    promise = plugin.didPrepare.call(plugin, context);
  });

  it('has a name', function() {
    assert.equal('html-manifest', plugin.name);
  });

  it('implements the correct hooks', function() {
    assert.equal(typeof plugin.configure, 'function');
    assert.equal(typeof plugin.didPrepare, 'function');
  });

  describe('didPrepare hook', function() {
    it('replaces index.html', function() {
      return assert.isFulfilled(promise)
        .then(function() {
          var data = fs.readFileSync(indexPage, {encoding: 'utf8'});
          var manifestPath = "/_rev/ccc/manifest.appcache";

          var $ = cheerio.load(data);
        
          assert.equal($('html').attr('manifest'), manifestPath);
        });
    });

  });
});