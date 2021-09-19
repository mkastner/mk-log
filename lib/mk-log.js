const fs = require("fs");
const path = require("path");
const colors = require("colors");
const tracer = require("tracer");

const env = process.env.NODE_ENV;

const defaultConfig = {
  logLevel: 'debug',
  infoFormat: 'long'
}

const configPath = path.resolve(`config/env/${env}-config.js`);

const config = defaultConfig;

try {
  fs.statSync(configPath);
  const requiredConfig = require(configPath);
  if (requiredConfig) {
    Object.assign(config, requiredConfig);
  }
  console.log('mk-log config settings:', config); 

} catch (err) {
  if (err.code = 'ENOENT') {
    console.log('mk-log could not find config at path location:');
    console.log(configPath);
    console.log('mk-log uses default config:', config); 
  } else throw err;

}


const formats = {
  default: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
  production: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
  test: '{{message}} (in {{file}}:{{line}})',
  development: '{{message}} (in {{file}}:{{line}})',
  error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}' // error format
}

const logFormat =  [
  formats[`${env}`] || formats.default, //default format
  {
    error: formats.error 
  },
];

const logPath = path.resolve(`log/${env}.log`),
  logger = tracer.colorConsole({
    format: logFormat, 
    dateformat: 'HH:MM:ss.L',
    filters: {
      log: colors.white,
      trace: colors.magenta,
      debug: [colors.blue, colors.bgWhite],
      info: colors.green,
      warn: colors.yellow,
      error: [colors.red, colors.bold],
    },
    transport(data) {
      console.log(data.output);
      const fileStream = fs.createWriteStream(logPath, {
        flags: "a",
        encoding: "utf8",
        mode: "0666",
      });
      fileStream.write(data.output + "\n");
    },
  });

try {

  tracer.setLevel(config.logLevel);
  logger.info("logLevel set to", config.logLevel);
} catch (err) {
  logger.error(err);
}

module.exports = logger;
