import { META } from '../core/metadata';

export function Controller(prefix = '') {
  return function (target: any) {
    Reflect.defineMetadata(META.controller, prefix, target);
  };
}