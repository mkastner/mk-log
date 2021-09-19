const tape = require('tape');
const log = require('../index');

tape('error exists', (t) => {
  try {
    throw new Error('An Error happened');
  } catch (e) {

    const errObj = log.error(e.message);
    t.ok(errObj, errObj.output.match(/error/), 'an error message');
    t.end();
  }
});

tape('show info message', (t) => {
  try {
    const logText =  'I am an info text';
    const logResult = log.info(logText);

    t.equal(logResult.message, logText);

  } catch (e) {
    console.log(e, e);
  } finally {
    t.end();
  }
});
