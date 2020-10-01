export type WorkerFn = () => Promise<void> | void

interface Context <D, P> {
  data: D,
  params: P,
  tasks: WorkerFn[]
}

export default class Chaining <D = any, P = any> {
  private readonly ctx: Context<D, P>

  constructor(data: D, params: P) {
    if (!data) throw new Error('data parameter is required')

    this.ctx = { data, params, tasks: [] }
  }

  get data() { return this.ctx.data; }
  get params() { return this.ctx.params; }

  queue(fn: WorkerFn) {
    this.ctx.tasks.push(fn);
    return this;
  }

  async exec() {
    while(this.ctx.tasks.length) {
      const next = this.ctx.tasks.shift();
      if (next) await next();
    }
    return this.data;
  }
}
