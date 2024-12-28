import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CreateadminService } from './users/createadmin/createadmin.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
    // Initialiser l'admin si nécessaire
    const initializeAdminService = app.get(CreateadminService);
    await initializeAdminService.createAdminIfNotExists();
  const config = new DocumentBuilder()
  .setTitle('NestJS API')
    .setDescription('API Documentation with JWT Authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe()); // Active la validation automatique
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
