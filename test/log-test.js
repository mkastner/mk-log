import tape from 'tape';
import log from '../lib/index.js';

tape('error exists', function(t) {

  t.plan(1);

  try {
    throw new Error('An Error happened');
  } catch (e) {

    log.error(e.message);

    let errObj = log.error(e.message);

    t.ok(errObj, errObj.output.match(/error/), 'an error message');

    t.end();

  }

});
