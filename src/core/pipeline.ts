import { META } from './metadata';
import { HttpException } from './exceptions';

export async function handleRequest(
  instance: any,
  route: any,
  req: any,
  res: any,
  globalPipes: any[] = []
) {
  const ctrlFilters: any[] = Reflect.getMetadata(META.filters, instance?.constructor) ?? [];
  const methodFilters: any[] = Reflect.getMetadata(META.filters, instance?.[route.handler]) ?? [];
  const allFilters: any[] = [...ctrlFilters, ...methodFilters];
  try {
    if (!instance) throw new Error('Controller instance is undefined');
    const handler = instance[route.handler];
    if (!handler) throw new Error('Handler not found');

    const paramsMeta: any[] = Reflect.getMetadata(META.params, handler) ?? [];
    const methodPipes: any[] = Reflect.getMetadata(META.pipes, handler) ?? [];
    const ctrlPipes: any[] = Reflect.getMetadata(META.pipes, instance.constructor) ?? [];
    const ctrlGuards: any[] = Reflect.getMetadata(META.guards, instance.constructor) ?? [];
    const methodGuards: any[] = Reflect.getMetadata(META.guards, handler) ?? [];
    const guards: any[] = [...ctrlGuards, ...methodGuards];

    const ctrlInterceptors: any[] = Reflect.getMetadata(META.interceptors, instance.constructor) ?? [];
    const methodInterceptors: any[] = Reflect.getMetadata(META.interceptors, handler) ?? [];
    const interceptors: any[] = [...ctrlInterceptors, ...methodInterceptors];

    // Guards
    for (const G of guards) {
      const guardInstance = typeof G === 'function' ? new G() : G;
      const canActivate = await guardInstance.canActivate(req);
      console.log('Guard:', guardInstance.constructor.name, '→', canActivate);
      if (!canActivate) throw new HttpException(403, 'Forbidden by guard');
    }

    // Params & Pipes
    const args: any[] = [];
    for (let i = 0; i < paramsMeta.length; i++) {
      const meta = paramsMeta[i];
      if (!meta) continue;

      let value;
      if (meta.type === 'param') value = req.params[meta.name];
      if (meta.type === 'query') value = req.query[meta.name];
      if (meta.type === 'body') value = meta.name ? req.body[meta.name] : req.body;

      const paramSpecificPipes = meta.pipes ?? [];
      const allPipes = [...globalPipes, ...ctrlPipes, ...methodPipes, ...paramSpecificPipes];

      for (const p of allPipes) {
        let pipeInstance;
        if (typeof p.pipe === 'function') pipeInstance = new p.pipe();
        else if (p.transform) pipeInstance = p; 
        else {
          console.error('Invalid pipe instance', p);
          continue;
        }
        console.log('Pipe before:', pipeInstance.constructor.name, 'value:', value);
        value = await pipeInstance.transform(value, meta);
        console.log('Pipe after:', pipeInstance.constructor.name, 'value:', value);
      }

      args[i] = value;
    }

    // Interceptors before
    for (const I of interceptors) {
      const interceptor = typeof I === 'function' ? new I() : I;
      if (interceptor.before) await interceptor.before(req);
    }

    // Handler
    const result = await handler.apply(instance, args);

    // Interceptors after
    for (const I of interceptors) {
      const interceptor = typeof I === 'function' ? new I() : I;
      if (interceptor.after) await interceptor.after(result, req);
      console.log('Interceptor after:', interceptor.constructor.name);
    }

    res.json(result);
  } catch (err: any) {
    if (allFilters.length) {
      for (const F of allFilters) {
        const filterInstance = typeof F === 'function' ? new F() : F;
        if (filterInstance.catch) {
          console.log('Filter caught error:', err.message);
          filterInstance.catch(err, req, res);
          return;
        }
      }
    }

    if (err instanceof HttpException) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
}