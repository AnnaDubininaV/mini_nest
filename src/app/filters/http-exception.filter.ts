import { HttpException } from '../../core/exceptions';
import { Request, Response } from 'express';

export class HttpExceptionFilter {
  catch(err: HttpException, req: Request, res: Response) {
    console.log('Filter caught error:', err.message);
    res.status(err.status ?? 500).json({ message: err.message });
  }
}