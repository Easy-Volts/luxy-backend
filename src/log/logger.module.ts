import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './winston-logger.config';
import { CustomLogger } from './logs.service';

@Module({
  imports: [WinstonModule.forRoot(winstonLoggerConfig)],
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
