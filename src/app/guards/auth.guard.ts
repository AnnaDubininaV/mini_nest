export class AuthGuard {
  async canActivate(req: any) {
    console.log('AuthGuard checking...');
    return true;
  }
}