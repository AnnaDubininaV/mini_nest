import { ZodType, ZodError } from 'zod';
import { HttpException } from '../../core/exceptions';


export class ZodBodyGuard<T = any> {
  constructor(private schema: ZodType<T>) {}

  async canActivate(req: any): Promise<boolean> {
    try {
      this.schema.parse(req.body);
      return true;
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const messages = err.issues.map(i => i.message).join(', ');
        throw new HttpException(400, `Invalid body: ${messages}`);
      }

      throw new HttpException(400, 'Invalid body');
    }
  }
}