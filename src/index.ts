/**
 * TODO:
 * - Improve jsdoc (add references, more details, etc)
 * - Add tests
 */

/**
 * Worker function
 */
export type WorkerFn = () => Promise<void> | void

/**
 * Internal execution context
 * @private
 */
interface Context <D, P> {
  /* Initial data */
  initialData: D

  /* Data accumulator */
  data: D

  /* Optional context parameters */
  params: P

  /* Workers to execute */
  tasks: WorkerFn[]

  /* Whether to execute in parallel or sequentially */
  parallel: boolean
}

/**
 * Helper for implementing async chainable classes
 */
export default class Chaining <D = any, P = any> {
  private readonly ctx: Context<D, P>

  /**
   * @param data - initial data where result will be stored. Think of it as accumulator for reducer
   * @param params - optional parameters, useful as global context for function execution.
   */
  constructor(data: D, params: P) {
    if (!data) throw new Error('data parameter is required')

    this.ctx = {
      initialData: data,
      data,
      params,
      tasks: [],
      parallel: false
    }
  }

  /**
   * @returns current stored data
   */
  protected get data() { return this.ctx.data }

  /**
   * @returns parameters
   */
  protected get params() { return this.ctx.params }

  /**
   * Tells to execute chained methods in parallel (default is FIFO order)
   */
  protected set parallel(value: boolean) { this.ctx.parallel = value }

  /**
   * Adds function to tasks queue for further execution by exec() method
   * @param fn - worker function. Should be bound to chain class and should take advantage on access
   * to data and params props as necessary. Returns reference to this for convenience, so you can
   * write like: return this.queue(async () => ...). Could be both synchronous or asynchronous
   */
  protected queue(fn: WorkerFn) {
    this.ctx.tasks.push(fn)
    return this
  }

  /**
   * Asynchronously executing functions added by queue method in FIFO order
   * @returns data accumulated after execution
   */
  public async exec() {
    // Reset accumulated data
    this.ctx.data = this.ctx.initialData

    if (this.ctx.parallel) {
      await Promise.all(this.ctx.tasks.map(task => task()))
    } else {
      while(this.ctx.tasks.length) {
        // We expect functon to be defined, otherwise it should be a runtime error
        const next = this.ctx.tasks.shift() as WorkerFn
        await next()
      }
    }

    return this.data
  }
}
