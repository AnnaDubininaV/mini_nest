import { META } from '../core/metadata';

export enum ParamType {
  PARAM = 'param',
  QUERY = 'query',
  BODY = 'body',
}

function createParamDecorator(type: ParamType, name?: string, pipe?: any) {
  return (target: any, key: string, index: number) => {
    const existing = Reflect.getMetadata(META.params, target[key]) ?? [];
    existing[index] = {
      type,
      name,
      pipes: pipe ? [{ pipe }] : [],
    };
    Reflect.defineMetadata(META.params, existing, target[key]);
  };
}

export const Param = (name?: string, pipe?: any) => createParamDecorator(ParamType.PARAM, name, pipe);
export const Query = (name?: string, pipe?: any) => createParamDecorator(ParamType.QUERY, name, pipe);
export const Body = (name?: string, pipe?: any) => createParamDecorator(ParamType.BODY, name, pipe);