var cheerio   = require('cheerio');
var RSVP      = require('rsvp');

module.exports = function(html, manifestPath) {
  var $ = cheerio.load(html.toString());
  $('html').attr('manifest', manifestPath);
  
  return new RSVP.resolve($.html());
};