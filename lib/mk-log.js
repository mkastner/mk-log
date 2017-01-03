/* jslint node: true, esversion: 6, strict: implied */

let path = require('path'),
    winston = require('winston'),
    environment = process.env.NODE_ENV,
    envConfig = require(path.resolve('config/env/' + environment + '-config')),
    levels = {
        debug: 7,
        info: 6,
        notice: 5,
        warning: 4,
        error: 3,
        crit: 2,
        alert: 1,
        emerg: 0
    },
    colors = {
        detail: 'grey',
        trace: 'white',
        debug: 'blue',
        enter: 'inverse',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    },
    logFile = 'log/' + environment + '.log',
    logLevel = 'debug',
    log = new(winston.Logger)({
        'transports': [
            new(winston.transports.Console)({
                level: logLevel,
                colorize: true,
                handleExceptions: true
            }),
            new(winston.transports.File)({
                filename: logFile,
                level: logLevel,
                handleExceptions: true
            })
        ]
    });

module.exports = (function() {

    if (envConfig.logLevel) {
        logLevel = envConfig.logLevel;
    } else {
        var error = new Error('No logLevel defined for environment "' + environment + '"');
        console.error(error);
    }

    log.setLevels(levels);

    winston.addColors(colors);

    //if (environment === 'development' || environment === 'test') {

    var loggerInfoOld = log.info;

    log.info = function info(msg) {
        var fileAndLine = traceCaller(1);
        return loggerInfoOld.call(this, fileAndLine + ": " + msg);
    };

    var loggerErrorOld = log.error;

    log.error = function error(msg) {
        var fileAndLine = traceCaller(1);
        return loggerErrorOld.call(this, fileAndLine + ": " + msg);
    };

    /**
     * Here's where I copied this useful piece of code from
     * http://stackoverflow.com/questions/13410754/i-want-to-display-the-file-name-in-the-log-statement
     * examines the call stack and returns a string indicating
     * the file and line number of the n'th previous ancestor call.
     * this works in chrome, and should work in nodejs as well.
     *
     * @param n : int (default: n=1) - the number of calls to trace up the
     *   stack from the current call.  `n=0` gives you your current file/line.
     *  `n=1` gives the file/line that called you.
     */

    function traceCaller(n) {
        if (isNaN(n) || n < 0) n = 1;
        n += 1;
        var s = (new Error()).stack,
            a = s.indexOf('\n', 5);
        while (n--) {
            a = s.indexOf('\n', a + 1);
            if (a < 0) {
                a = s.lastIndexOf('\n', s.length);
                break;
            }
        }
        var b = s.indexOf('\n', a + 1);
        if (b < 0) b = s.length;
        a = Math.max(s.lastIndexOf(' ', b), s.lastIndexOf('/', b));
        b = s.lastIndexOf(':', b);
        s = s.substring(a + 1, b);
        return s;
    }

    return log;

})();
