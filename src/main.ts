import { ImATeapotException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true, //nie pokazuje błedów 
    whitelist: true,            //sprawdza poprawnosc danych w dto
    forbidNonWhitelisted: true, //jw
    transform: true,             //sam zamienia parametr na typ ktory zadeklarujemy w requescie, np. na number
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  //app.useGlobalFilters(new GlobalExceptionFilter);
  await app.listen(3000);
}
bootstrap();
