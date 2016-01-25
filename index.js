var join = require('path').join;
var relative = require('path').relative;

var isExists = function(id) {
  var isModuleExists = false;
  try {
    require.resolve(id);
    isModuleExists = true;
  } catch(e) {}

  return isModuleExists;
}


module.exports = function(id) {
  var isModuleExists = false;

  if (isExists(id)) {
    isModuleExists = true;
  } else {
    var dir = process.cwd();
    var paths = [
      '/node_modules'
    ];

    dir.split('/').reduce(function(current, prev) {
      var path = join('/', current, prev);
      paths.push(join('/', path, 'node_modules'));

      return path;
    });

    if (!paths.length) {
      throw new Error('Something went wrong while paths were calculating');
    }

    paths = paths.reverse();
    var index = 0;

    while (!isModuleExists && index < paths.length) {
      var path = paths[index];
      var requiredModuleDir = relative(__dirname, path);
      var requiredModule = join(requiredModuleDir, id);

      try {
        require.resolve(requiredModule);
        isModuleExists = true;
      } catch(e) {}

      index++;
    }
  }

  return isModuleExists;
};
