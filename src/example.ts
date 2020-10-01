import Chaining from ".";


const delay = (t: number) => new Promise(r => setTimeout(r, t));


class Chainable extends Chaining<string[], { foo: string } > {
  step1(d: number) {
    console.log('queued step1');
    return this.queue(async () => {
      await delay(d);
      this.data.push('step1');
      console.log('executed step1');

      this.params
    });
  }

  step2(d: number) {
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

  // Just sync function when order doesn't matter, will be executed before exec()
  step34() {
    this.data.push('step 34')
    return this
  }

  step4() {
    console.log('queued step4');
    // Using params from constructor
    return this.queue(() => {
      this.data.push(`using ctor param: ${this.params.foo}`);
      console.log('executed step3');

      this.data
    });
  }
}

async function main() {
  console.log('started');

  const chain = new Chainable([], { foo: 'bar' });
  const data = await chain.step1(1000).step2(2000).step3().step34().step4().exec();

  console.log('data: ', data);
}

if (require.main === module) {
  main();
}