import { META } from '../core/metadata';

function createRoute(method: string) {
  return (path = '') =>
    (target: any, key: string) => {
      const routes =
        Reflect.getMetadata(META.routes, target.constructor) ?? [];

      routes.push({
        method,
        path,
        handler: key,
      });

      Reflect.defineMetadata(
        META.routes,
        routes,
        target.constructor,
      );
    };
}

export const Get = createRoute('get');
export const Post = createRoute('post');