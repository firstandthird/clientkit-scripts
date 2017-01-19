const test = require('tape');
const fs = require('fs');

const RunKitTask = require('../scripts.js');
const input = 'test/inputs/input1.js';
const input2 = 'test/inputs/input2.js';
const inputIgnore = 'test/inputs/ignore.js';
const output = 'test/outputs/output1.js';
const outputMin = 'test/outputs/output.min.js';
const outputMap = 'test/outputs/output1.js.map';
const outputGlobal = 'test/outputs/outputGlobal.js';

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

test('process global babel', (t) => {
  const task = new RunKitTask('test task', {
    globalBabel: true,
    // babelIgnore: '*ignore'
  }, {});
  task.process('', outputGlobal, (err, result) => {
    t.equal(err, null);
    fs.exists(output, (exists) => {
      t.equal(exists, true);
      t.end();
    });
  });
});
