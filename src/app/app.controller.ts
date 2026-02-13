import { Controller } from '../decorators/controller';
import { Get, Post } from '../decorators/route';
import { Body, Param } from '../decorators/params';
import { AppService } from './app.service';
import { UsePipe } from '../decorators/pipes';
import { UseGuard } from '../decorators/guards';
import { UseInterceptor } from '../decorators/interceptors';
import { UseFilter } from '../decorators/filters';
import { ParseIntPipe, LogPipe } from './pipes/parse-int.pipe';
import { AuthGuard } from './guards/auth.guard';
import { LogInterceptor } from './interceptors/log.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import z from 'zod';
import { ZodBodyGuard } from './guards/zod-body.guard';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive().optional(),
});


@Controller('/users')
@UsePipe(LogPipe) // controller pipe
@UseGuard(AuthGuard)
@UseInterceptor(LogInterceptor)
@UseFilter(HttpExceptionFilter)

export class AppController {
  constructor(private appService: AppService) {}

  @Get('/:id')
  @UsePipe(ParseIntPipe) 
  getUser(@Param('id') id: number) {
    console.log('Handler called with id:', id);
    return this.appService.getHello(id);
  }

  @Post('/')
  @UseGuard(new ZodBodyGuard(CreateUserSchema))
  createUser(@Body('name') name: string) {
    console.log('Handler called to create user with name:', name);
    const newUser = this.appService.createUser(name);
    return { message: 'User created', user: newUser };
  }
}