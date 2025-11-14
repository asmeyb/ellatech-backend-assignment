import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that do not have any decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transform payloads to be objects typed according to their DTO classes
      disableErrorMessages: false, // set to true in production for security reasons
    }),
  )

  await app.listen(3000);
}
bootstrap();
