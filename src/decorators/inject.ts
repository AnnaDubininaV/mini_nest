import 'reflect-metadata';
import { META } from '../core/metadata';

export function Inject(token: any) {
  return (target: any, _propertyKey: string | symbol, parameterIndex: number) => {
    const existing =
      Reflect.getMetadata(META.inject, target) ?? [];
    existing[parameterIndex] = token;
    Reflect.defineMetadata(META.inject, existing, target);
  };
};