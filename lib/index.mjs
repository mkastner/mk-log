import fs from 'fs';
import path from 'path';
import colors from 'colors';
import tracer from 'tracer';

const env = process.env.NODE_ENV;
const logPath = path.resolve(`log/${env}.log`);
const logger = tracer.colorConsole({
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
    const fileStream = fs.createWriteStream(logPath, {
      flags: 'a',
      encoding: 'utf8',
      mode: '0666'
    });
    fileStream.write(data.output + '\n');
  }
});
const configPath = path.resolve(`config/env/${env}-config.js`);
const config = import(`${configPath}`);

try {
  tracer.setLevel(config.logLevel);
  logger.info('logLevel set to', config.logLevel);
} catch (err) {
  logger.error(err);
}

export default logger;
