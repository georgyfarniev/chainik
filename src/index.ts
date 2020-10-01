const assert = require('assert');

const delay = (t) => new Promise(r => setTimeout(r, t));

class Chaining {
  constructor(data, params) {
    assert(data, 'Initial data is required');

    this._ctx = {
      data,
      params,
      tasks: []
    };
  }

  get data() { return this._ctx.data; }
  set data(value) { this._ctx.data = value; }
  get params() { return this._ctx.params; }

  queue(fn) {
    this._ctx.tasks.push(fn);
    return this;
  }

  async exec() {
    while(this._ctx.tasks.length) await this._ctx.tasks.shift()();
    return this._ctx.data;
  }
}


class Chainable extends Chaining {
  step1(d) {
    console.log('queued step1');
    return this.queue(async () => {
      await delay(d);
      this.data.push('step1');
      console.log('executed step1');
    });
  }

  step2(d) {
    console.log('queued step2');
    return this.queue(async () => {
      await delay(d);
      this.data.push('step2');
      console.log('executed step2');
    });
  }

  step3() {
    console.log('queued step3');
    return this.queue(() => {
      this.data.push('non-async step');
      console.log('executed step3');
    });
  }

  step4() {
    console.log('queued step4');
    // Using params from constructor
    return this.queue(() => {
      this.data.push(`using ctor param: ${this.params.foo}`);
      console.log('executed step3');
    });
  }
}

async function main() {
  console.log('started');

  const chain = new Chainable([], { foo: 'bar' });
  const data = await chain.step1(1000).step2(2000).step3().step4().exec();

  console.log('data: ', data);
}

if (require.main === module) {
  main();
}