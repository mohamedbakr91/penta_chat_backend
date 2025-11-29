import './shared/apm';
import { ecsFormat } from '@elastic/ecs-winston-format';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClsService } from 'nestjs-cls';
import 'winston-daily-rotate-file';
import { format, transports } from 'winston';
import { HTTPRequestInterceptor } from './shared/interceptors/http-interceptor';
import { HTTPDTOValidationPipe } from './shared/pipes/validation-dto-pipe';
import helmet from 'helmet';
import * as compression from 'compression';
import { WinstonModule } from 'nest-winston';
import { RedisIoAdapter } from './shared/adapters/redis-io.adapter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: format.combine(
        format.errors({ stack: true }),
        ecsFormat({ convertReqRes: true, convertErr: true }),
      ),
      transports: [
        new transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
          format: format.combine(
            ecsFormat({
              convertErr: true,
              apmIntegration: true,
            }),
          ),
        }),

        new transports.DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          format: ecsFormat(),
        }),

        new transports.Console({
          level: 'debug',
          format: format.combine(
            ecsFormat({ convertReqRes: true, convertErr: true }),
          ),
        }),
      ],
      exceptionHandlers: [
        new transports.DailyRotateFile({
          filename: 'logs/exceptions-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
        }),
      ],
      rejectionHandlers: [
        new transports.DailyRotateFile({
          filename: 'logs/rejections-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
        }),
      ],
    }),
  });

  app.use(helmet()); // بدون أي خيارات
  app.use(compression());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalInterceptors(new HTTPRequestInterceptor(app.get(ClsService)));
  app.useGlobalPipes(new HTTPDTOValidationPipe());
  app.setGlobalPrefix('api');

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);

  const config = new DocumentBuilder()
    .setTitle('Penta_chat')
    .setDescription('Messages System REST API Documentation')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },

      'JWT',
    )
    .build();

  const document = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });
  await app.listen(process.env.PORT || 7000);
}

bootstrap();
