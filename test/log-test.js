/* jslint node: true, esversion: 6, strict: implied */

var tape = require('tape'),
    log = require('../index');

tape('log test', function(t) {



    try {

        log.info('I am an Info log');

        throw new Error('An Error happened');

    } catch (e) {

        log.error(e.message);

        t.end();

    }

});
