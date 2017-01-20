const test = require('tape');
const fs = require('fs');
const RunKitTask = require('../scripts.js');
const input = 'test/inputs/input1.js';
const input2 = 'test/inputs/input2.js';
const inputShim = 'test/inputs/shim1.js';
const output = 'test/outputs/output1.js';
const outputMin = 'test/outputs/output.min.js';
const outputMap = 'test/outputs/output1.js.map';
const outputShim = 'test/outputs/outputShim.js';

test('process one input', (t) => {
  const task = new RunKitTask('test task', {}, {});
  task.process(input, output, (err, result) => {
    t.equal(err, null);
    fs.exists(output, (exists) => {
      t.equal(exists, true);
      t.end();
    });
  });
});

test('process output map', (t) => {
  const task = new RunKitTask('test task', {
    sourcemap: true
  }, {});
  task.process(input, outputMap, (err, result) => {
    t.equal(err, null);
    fs.exists(outputMap, (exists) => {
      t.equal(exists, true);
      t.end();
    });
  });
});

test('minifies ', (t) => {
  const task = new RunKitTask('test task', {
    minify: true
  }, {});
  task.process(input, outputMin, (err, result) => {
    t.equal(err, null);
    const stat1 = fs.statSync(output);
    const stat2 = fs.statSync(outputMin);
    t.notEqual(stat1.size, stat2.size);
    t.end();
  });
});

test('process multiple inputs', (t) => {
  const task = new RunKitTask('test task', {}, {});
  task.process([input, input2], output, (err, result) => {
    t.equal(err, null);
    fs.exists(output, (exists) => {
      t.equal(exists, true);
      t.end();
    });
  });
});

test('can shim a file', (t) => {
  const task = new RunKitTask('test task', {
    shim: true
  }, {});
  task.process([inputShim], outputShim, (err, result) => {
    t.equal(err, null);
    fs.readFile(outputShim, (fileErr, data) => {
      t.equal(fileErr, null);
      t.equal(data.toString().indexOf("window['$']") > -1, true);
      t.end();
    });
  });
});
