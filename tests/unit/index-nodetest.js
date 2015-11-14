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

function rm(path) {
    try {
    fs.unlinkSync(path);
  } catch(e) {
    if ( e.code != 'ENOENT' ) throw e;
  }
}

function cp(src, dest) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}

function readFile(path) {
  return fs.readFileSync(process.cwd() + path, {encoding: 'utf8'});
}


describe('the deploy plugin object', function() {
  var fixtureRoot;
  var distDir;
  var plugin;
  var promise;
  var indexPage;
  var fixturePage;
  var manifestFile;

  before(function() {
    fixtureRoot = process.cwd() + '/tests/fixtures/dist'
    distDir = process.cwd() + '/tmp/deploy-dist';
    indexPage = distDir + '/index.html';
    fixturePage = fixtureRoot + '/index.html';
    manifestFile = distDir + '/manifest.appcache';
    mkdir(distDir);
  });

  beforeEach(function() {
    var subject = require('../../index');
    
    rm(manifestFile)
    rm(indexPage)
    cp(fixturePage, indexPage);

    plugin = subject.createDeployPlugin({
      name: 'html-manifest'
    });

    var context = {
      ui: {write: function() {}, writeLine: function() {}},
      config: {
        'html-manifest': {
          prependPath: 'https://mycdn.com/',
          excludePaths: ['index.html'],
          includePaths: ['/'],
          distDir: function(context) {
            return distDir;
          }
        }
      },
      revisionData: {
        revisionKey: '89b1d82820a24bfb075c5b43b36f454b'
      },

      distFiles: [
        'assets/foo-178d195608c0b18cf0ec5e982b39cad8.js',
        'assets/bar-da3d0fb7db52f8273550c11403df178f.css',
        'images/logo-89b1d82820a24bfb075c5b43b36f454b.png',
        'index.html'
      ]
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
    it('replaces index.html html tag manifest attribute', function() {
      return assert.isFulfilled(promise)
        .then(function() {
          var data = fs.readFileSync(indexPage, {encoding: 'utf8'});
          var manifestPath = "/_rev/89b1d82820a24bfb075c5b43b36f454b/manifest.appcache";

          var $ = cheerio.load(data);
        
          assert.equal($('html').attr('manifest'), manifestPath);
        });
    });

    it('creates a manifest.appcache file in dest directory', function() {
      var manifestFile = distDir + '/manifest.appcache';

      return assert.isFulfilled(promise)
        .then(function() {
          var file = fs.readFileSync(manifestFile, {encoding: 'utf8'})
          var expected = fs.readFileSync(process.cwd() +'/tests/fixtures/manifests/manifest.appcache', {encoding: 'utf8'});
          assert.equal(file, expected);          
        });
    });

  });
});