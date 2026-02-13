import { META } from '../core/metadata';

export function UsePipe(pipe: any) {
  return function(target: any, key?: string | symbol, descriptorOrIndex?: any) {
    // Parameter decorator
    if (typeof descriptorOrIndex === 'number') {
      if (!key) throw new Error('@UsePipe param decorator missing key');
      const existingParams = Reflect.getMetadata(META.params, target[key]) || [];
      existingParams[descriptorOrIndex] = {
        ...(existingParams[descriptorOrIndex] || {}),
        pipes: [...(existingParams[descriptorOrIndex]?.pipes || []), { pipe }],
      };
      Reflect.defineMetadata(META.params, existingParams, target[key]);
      return;
    }

    // Method decorator
    if (key !== undefined) {
      const existingPipes = Reflect.getMetadata(META.pipes, target[key]) || [];
      Reflect.defineMetadata(META.pipes, [...existingPipes, { pipe }], target[key]);
      return;
    }

    // Class decorator
    const existingClassPipes = Reflect.getMetadata(META.pipes, target) || [];
    Reflect.defineMetadata(META.pipes, [...existingClassPipes, { pipe }], target);
  };
}