import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true, //nie pokazuje błedów 
    whitelist: true,            //sprawdza poprawnosc danych w dto
    forbidNonWhitelisted: true, //jw
    transform: true             //sam zamienia parametr na typ ktory zadeklarujemy w requescie, np. na number
  }))
  await app.listen(3000);
}
bootstrap();
