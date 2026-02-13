import { META } from '../core/metadata';

// @UseGuard(GuardClass)
export function UseGuard(guard: any) {
  return (target: any, key?: string | symbol) => {
    if (key) {
      // method guard
      const guards = Reflect.getMetadata(META.guards, target[key]) ?? [];
      guards.push(guard);
      Reflect.defineMetadata(META.guards, guards, target[key]);
    } else {
      // class guard
      const guards = Reflect.getMetadata(META.guards, target) ?? [];
      guards.push(guard);
      Reflect.defineMetadata(META.guards, guards, target);
    }
  };
}