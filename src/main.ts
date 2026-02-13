import 'reflect-metadata';
import { NestFactory } from './core/nest-factory';
import { AppModule } from './app/app.module';
import { LogPipe } from './app/pipes/parse-int.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, [new LogPipe()]);
  app.listen(3000);
}

bootstrap();