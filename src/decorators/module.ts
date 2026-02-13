import { Container } from '../core/container';
import { META } from '../core/metadata';

export function Module(meta: {
  providers?: any[];
  controllers?: any[];
  imports?: any[];
  exports?: any[];
}) {
  return (target: any) => {
    Reflect.defineMetadata(META.module, meta, target);
  };
}