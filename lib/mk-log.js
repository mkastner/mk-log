const
  fs = require('fs'),
  path = require('path'),
  colors = require('colors'),
  tracer = require('tracer'),
  env = process.env.NODE_ENV,
  logPath = path.resolve(`log/${env}.log`),
  logger = tracer.colorConsole({
    filters: {
      log: colors.white,
      trace: colors.magenta,
      debug: [colors.blue, colors.bgWhite],
      info: colors.green,
      warn: colors.yellow,
      error: [colors.red, colors.bold]
    },
    transport: function transport(data) {
      console.log(data.output);
      let fileStream = fs.createWriteStream(logPath, {
        flags: 'a',
        encoding: 'utf8',
        mode: '0666'
      });
      fileStream.write(data.output + '\n');
    }
  });

try {
  let
    configPath = path.resolve(`config/env/${env}-config.js`),
    config = require(configPath);
  tracer.setLevel(config.logLevel);
  logger.info('logLevel set to', config.logLevel);
} catch (err) {
  logger.error(err);
}

module.exports = logger;
