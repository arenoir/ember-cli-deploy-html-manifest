var assert = require('ember-cli/tests/helpers/assert');
var cheerio = require('cheerio');
var fs = require('fs');

describe('replace-html-manifest', function() {
  var subject;

  before(function() {
    subject = require('../../../../lib/utilities/replace-html-manifest');
  });

  it('adds manifest attribute to html tag', function() {
    var data = fs.readFileSync(process.cwd() + '/tests/fixtures/dist/index.html');
    var manifestPath = "/_rev/ccc/manifest.appcache"
    
    return assert.isFulfilled(subject(data, manifestPath))
      .then(function(html) {
        var $ = cheerio.load(html)
        
        assert.equal($('html').attr('manifest'), manifestPath);
      });
  });
});