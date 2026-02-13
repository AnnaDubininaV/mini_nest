export class ParseIntPipe {
  transform(value: any) {
    const val = parseInt(value, 10);
    if (isNaN(val)) throw new Error('Invalid number');
    return val;
  }
}

export class LogPipe {
  async transform(value: any, meta: any) {
    console.log('LogPipe value:', value);
    return value;
  }
}