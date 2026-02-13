import { META } from '../core/metadata';

// @UseInterceptor(InterceptorClass)
export function UseInterceptor(interceptor: any) {
  return (target: any, key?: string | symbol) => {
    if (key) {
      // method interceptor
      const interceptors = Reflect.getMetadata(META.interceptors, target[key]) ?? [];
      interceptors.push(interceptor);
      Reflect.defineMetadata(META.interceptors, interceptors, target[key]);
    } else {
      // class interceptor
      const interceptors = Reflect.getMetadata(META.interceptors, target) ?? [];
      interceptors.push(interceptor);
      Reflect.defineMetadata(META.interceptors, interceptors, target);
    }
  };
}