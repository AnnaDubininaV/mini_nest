import { Injectable } from '../decorators/injectable';

@Injectable()
export class AppService {
private users: any[] = [];

  getHello(id: number) {
    return { message: `Hello ${id}` };
  }

  createUser(name: string) {
    const id = this.users.length + 1;
    const user = { id, name };
    this.users.push(user);
    return user;
  }
}