## The problem
Usually module availability could be checked using native `require` method.

```js
const isExists = false;

try {
  require.resolve('angular')
  isExists = true;
} catch (e) {
    
}
```

But here is problem: I don't want to write `try catch` statements :)

OK. The real problem appears when developing component with auto requiring modules. 
`require` and `require.resolve` will work correctly until component is in local node_modules.
After [npm link](https://docs.npmjs.com/cli/link) (that is very useful while developing npm packages) or if components
is installed as global package - `require` and `require.resolve` will work from global context (at \*nix systems
`/usr/local/lib/node_modules`). 

For example:
I am developing build / server like webpack. And there are loaders (babel-loader, html-loader, json-loader etc).
And I want my builder to require loader automatically when it is needed. So my `node_modules` should be as below:

    my-work-directory/node_modules
                             |-builder/
                             |-babel-loader/
                             |-html-loader/
                             |-json-loader/
         
In this case if I run `require('babe-loader')` at `builder` component - it will work.
But If I `npm link` my build (for better developing process) or make in global - my `node_modules` will be as below:

    /usr/local/lib/node_modules
                            |-builder/
        

    my-work-directory/node_modules
                             |-(linked directory) builder/
                             |-babel-loader/
                             |-html-loader/
                             |-json-loader/

And in this case if I run `require('babe-loader')` at `builder` - will be exception `Error: Cannot find module 'babel-loader'`.
This happens because `require` depends on **\_\_dirname** that equals `/usr/local/lib/node_modules/builder` at `builder` component. 
Here is documentation how [modules are loading from node_modules folder](https://nodejs.org/docs/latest/api/modules.html#modules_loading_from_node_modules_folders)

## Solution

`npm install --save magic-require`

First resolve modules according to caller module **\_\_dirname** and if not resolved - try to resolve according to current `process.cwd()`. 
100% supports `package.json` if [loads module as directory](https://nodejs.org/docs/latest/api/modules.html#modules_all_together).

Examples

```js
import magic from 'magic-require';


magic.isExists('path'); // true
magic.isExists('qwert'); // false

magic.resolve('angular'); // ../../node_modules/angular/angular.js

const React = magic('react');
```

Available methods

- `isExists(module)` - returns **true** if module exists and **false** - if not.
- `resolve(module)` - returns relative path to requested module from current executing module's **\_\_dirname** or `null`. 


## Community
You are always welcome for ideas and pull requests :)
