import 'reflect-metadata';

import 'reflect-metadata';
import { META } from './metadata';

export class Container {
  private instances = new Map<any, any>();

  resolve<T>(token: any): T {
    console.log('Resolving', token.name);
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const target = token;
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) ?? [];
    const injectTokens = Reflect.getMetadata(META.inject, target) ?? [];

    const deps = paramTypes.map((type: any, i: number) =>
      this.resolve(injectTokens[i] ?? type),
    );

    const instance = new target(...deps);
    this.instances.set(token, instance);
    return instance;
  }
}