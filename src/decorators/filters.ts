import { META } from '../core/metadata';

// @UseFilter(FilterClass)
export function UseFilter(filter: any) {
  return (target: any, key?: string | symbol) => {
    if (key) {
      // method filter
      const filters = Reflect.getMetadata(META.filters, target[key]) ?? [];
      filters.push(filter);
      Reflect.defineMetadata(META.filters, filters, target[key]);
    } else {
      // class filter
      const filters = Reflect.getMetadata(META.filters, target) ?? [];
      filters.push(filter);
      Reflect.defineMetadata(META.filters, filters, target);
    }
  };
}