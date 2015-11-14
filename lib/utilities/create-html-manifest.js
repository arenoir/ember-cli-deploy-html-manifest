var Promise   = require('ember-cli/lib/ext/promise');
var fs        = require('fs');
var path      = require('path');


module.exports = function(distFiles, options) {
  var options        = options || {};
  var includePaths   = options.includePaths || [];
  var excludePaths   = options.excludePaths || [];
  var prependPath    = options.prependPath || '';
  var network        = options.network || ['*'];
  var fallback       = options.fallback || [];
  var version        = options.version || false;

  var lines = ["CACHE MANIFEST"];

  if (version) {
    lines.push("# version " + version);
  }

  lines.push("", "CACHE:");

  distFiles.forEach(function(path) {
    if (excludePaths.indexOf(path) === -1) {
      lines.push(prependPath + path);
    }
  });

  includePaths.forEach(function(path) {
    lines.push(path);
  });

  lines.push("","NETWORK:");

  network.forEach(function(line) {
    lines.push(line);
  });

  if (fallback.length) {
    lines.push("", "FALLBACK:");
    lines.push.apply(lines, fallback);
  }

  return lines.join("\n");
}
