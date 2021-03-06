'use strict';
const TaskKitTask = require('taskkit-task');
const Browserify = require('browserify');
const babelify = require('babelify');
const shim = require('browserify-shim');
const bes2015 = require('babel-preset-es2015');
const addModuleExports = require('babel-plugin-add-module-exports');
const uglifyify = require('uglifyify');
const exorcist = require('exorcist');
const path = require('path');

class ScriptsTask extends TaskKitTask {

  get description() {
    return 'Compiles your various client-executable files into a minified, source-mapped, browser-compatible js file that you can embed in a webpage';
  }

  process(input, filename, done) {
    const options = Object.assign({}, this.options.browserify);
    options.entries = [input];
    const b = new Browserify(options);

    if (this.options.shim) {
      b.transform(shim);
    }

    const babelConfig = this.options.babel || {};

    let currentTransform = b.transform(babelify, {
      global: babelConfig.global,
      presets: [bes2015],
      plugins: [addModuleExports],
      ignore: babelConfig.ignore
    });

    if (this.options.minify) {
      currentTransform = currentTransform.transform(uglifyify, { global: true });
    }
    const result = currentTransform.bundle();
    // sourcemaps must be explicitly false to disable:
    if (this.options.sourcemap !== false) {
      result.pipe(exorcist(`${path.join(this.options.dist || '', filename)}.map`));
      return this.write(filename, result, done);
    }
    return this.write(filename, result, done);
  }
}
module.exports = ScriptsTask;
