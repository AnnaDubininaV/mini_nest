export class LogInterceptor {
  async before(req: any) {
    console.log('Interceptor before handler');
  }
  async after(result: any, req: any) {
    console.log('Interceptor after handler:', result);
  }
}