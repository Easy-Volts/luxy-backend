import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const winstonLoggerConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    }),
  ],
};
