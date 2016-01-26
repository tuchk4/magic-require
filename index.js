var join = require('path').join;
var relative = require('path').relative;

var isModuleResolved = function(id) {
  var isModuleExists = false;
  try {
    require.resolve(id);
    isModuleExists = true;
  } catch(e) {}

  return isModuleExists;
};

function resolve(id) {
  var modulePath = null;

  if (isModuleResolved(id)) {
    modulePath = require.resolve(id);
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

    while (!modulePath && index < paths.length) {
      var path = paths[index];
      var requiredModuleDir = relative(__dirname, path);
      var requiredModule = join(requiredModuleDir, id);

      try {
        modulePath = require.resolve(requiredModule);
      } catch(e) {}

      index++;
    }
  }

  return modulePath;
}


var isExists = function(id) {
  return !!resolve(id);
};

var magicRequire = (id) => {
  var path = resolve(id);

  if (!path) {
    throw new Error('Can not find module "' + id +'"');
  }

  return require(path);
};

magicRequire.resolve = resolve;
magicRequire.isExists = isExists;


module.exports = magicRequire;
