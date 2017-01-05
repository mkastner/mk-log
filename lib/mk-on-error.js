/* jslint node: true, strict: implied */

var log = require('./mk-log');

module.exports = function onError(err) {

    /* TODO: This needs to be fixed */

	console.error(err);

	//log.error(err);

	//log.error(err.stack);

};
