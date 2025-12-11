import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    
    origin: true, //fetch for any ip address which is very risky for production use this later ['exp://192.168.0.100:8081']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.enableCors(); 
  app.listen(3000, '0.0.0.0');
  console.log(`Server is running on: http://localhost:3000`);
}
bootstrap();