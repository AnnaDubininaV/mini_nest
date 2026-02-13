import express, { Request, Response, Express } from 'express';
import { Container } from './container';
import { META } from './metadata';
import { handleRequest } from './pipeline';

export class NestFactory {
  static async create(AppModule: any, globalPipes: any[] = []) {
    const container = new Container();
    const app = express();
    app.use(express.json());

    const moduleMeta = Reflect.getMetadata(META.module, AppModule);
    const controllers = moduleMeta.controllers ?? [];

    controllers.forEach((Ctrl: any) => {
      const instance = container.resolve(Ctrl);
      const prefix = Reflect.getMetadata(META.controller, Ctrl) ?? '';
      const routes = Reflect.getMetadata(META.routes, Ctrl) ?? [];

      routes.forEach((route: any) => {
        app[route.method as keyof Express](prefix + route.path, (req:Request, res:Response) =>
          handleRequest(instance, route, req, res, globalPipes)
        );
      });
    });

    return { listen: (port: number) => app.listen(port, () => console.log(`Server running on ${port}`)) };
  }
}