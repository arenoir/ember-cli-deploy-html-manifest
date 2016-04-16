'use strict';
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var assert  = chai.assert;
var fs  = require('node-fs');


function readFile(path) {
  return fs.readFileSync(process.cwd() + path, {encoding: 'utf8'});
}

describe('create-html-manifest', function() {
  var options, createManifest, distFiles;

  before(function() {
    createManifest = require('../../../../lib/utilities/create-html-manifest');

    options = {
      version: '89b1d82820a24bfb075c5b43b36f454b',
      excludePaths: ['index.html'],
      includePaths: ['/']
    };

    distFiles = [
      'assets/foo-178d195608c0b18cf0ec5e982b39cad8.js',
      'assets/bar-da3d0fb7db52f8273550c11403df178f.css',
      'images/logo-89b1d82820a24bfb075c5b43b36f454b.png',
      'index.html'
    ];
  });

  it('it prepends path', function() {

    options.prependPath = "https://mycdn.com/";

    var expected = readFile('/tests/fixtures/manifests/manifest.appcache');

    var result = createManifest(distFiles, options);

    assert.equal(result, expected);
  });


  it('it excludes paths with glob', function() {

    options.excludePaths = ["index.html", "assets/*.css"];

    var expected = readFile('/tests/fixtures/manifests/manifest.nocss');

    var result = createManifest(distFiles, options);

    assert.equal(result, expected);
  });

});


