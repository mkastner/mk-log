'use strict';

const
  fs = require('fs'),
  path = require('path'),
  colors = require('colors'),
  tracer = require('tracer'),
  env = process.env.NODE_ENV,
  logPath = path.resolve(`log/${env}.log`),
  configPath = path.resolve(`config/env/${env}-confi.js`),
  tracerSettings = {
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
  };


try {
  let config = require(configPath);
  //tracerSettings.level = config.logLevel;
  if (config.logLevel) {
    console.log(`found logLevel ${config.logLevel} in ${configPath}`);
    tracerSettings.level = config.logLevel;
  }
} catch(err) {
  tracerSettings.level = 'info';
  console.log(`could not find ${configPath}`);
}

console.log(`tracer logLevel set to ${tracerSettings.level} in ${configPath}`);

const logger = tracer.colorConsole(tracerSettings);

module.exports = logger;
