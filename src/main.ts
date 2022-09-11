import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'path';
import { AppModule } from './app.module';
async function bootstrap(): Promise<void> {
  let ssl = {};
  if (process.env.NODE_ENV === 'development') {
    const currentDir: string = process.cwd();
    const keyFile = fs.readFileSync(path.join(currentDir, 'certs', 'localhost.key'));
    const certFile = fs.readFileSync(path.join(currentDir, 'certs', 'localhost.crt'));
    const caFile = fs.readFileSync(path.join(currentDir, 'certs', 'rootCA.pem'));
    ssl = {
      httpsOptions: {
        key: keyFile,
        cert: certFile,
        ca: caFile,
      },
    };
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true, ...ssl });
  app.enableCors();
  app.use(compression());
  app.useStaticAssets(resolve(__dirname, '..', 'public'));
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder().setTitle('NestJS').addBearerAuth().setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    const options: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup('swagger', app, document, options);
  }
  const port = 3000;
  await app.listen(port);
  const env: string = process.env.NODE_ENV ?? 'development';
  const url: string = await app.getUrl();
  Logger.log(`Enviroment: ${env}`, 'Bootstrap');
  Logger.log(`Server started running on ${url}`, 'Bootstrap');
}
void bootstrap();
