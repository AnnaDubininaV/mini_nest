import 'reflect-metadata';
import { META } from '../core/metadata';

export function Injectable(token?: any) {
  return (target: any) => {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) ?? [];
    Reflect.defineMetadata('design:paramtypes', paramTypes, target);
  };
};