var minimatch = require("minimatch");

module.exports = function(distFiles, options) {
  options = options || {};

  var includePaths   = options.includePaths || [];
  var excludePaths   = options.excludePaths || [];
  var prependPath    = options.prependPath || '';
  var network        = options.network || ['*'];
  var fallback       = options.fallback || [];
  var version        = options.version || false;

  var lines = ["CACHE MANIFEST"];
  var distExcludes = [];

  if (version) {
    lines.push("# version " + version);
  }

  lines.push("", "CACHE:");

  excludePaths.forEach(function(path) {
    var _e = minimatch.match(distFiles, path);
    distExcludes = distExcludes.concat(_e);
  });
  
  distFiles.forEach(function(path) {
    if (distExcludes.indexOf(path) === -1) {
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
};
