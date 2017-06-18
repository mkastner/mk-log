/* jslint node: true, esversion: 6, strict: implied */

var tape = require('tape'),
  log = require('../index');

tape('error exists', function(t) {

  t.plan(1);

  try {
    throw new Error('An Error happened');
  } catch (e) {
    log.error(e.message);
    let errObj = log.error(e.message);
    t.ok(errObj, errObj.output.match(/error/));
    t.end();
  }

});
