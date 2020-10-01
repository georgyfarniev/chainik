# promise-chain

Simple helper for building async chainable classes without external dependencies

## Features
 - Typescript types out of the box
 - No external dependencies
 - Works in browser and node
 - Simple
 
## Installation
```shell
npm i -g promise-chain
```

## For usage, see example below (more examples and documentation coming soon!):

```ts
import Chaining from 'promise-chain'

const delay = (t: number) => new Promise(r => setTimeout(r, t))

class Chainable extends Chaining<string[], { foo: string } > {
  constructor(data: string[], params: { foo: string }) {
    super(data, params)
  }

  step1(d: number) {
    console.log('queued step1')
    return this.queue(async () => {
      await delay(d)
      this.data.push('step1')
      console.log('executed step1')
    })
  }

  step2(d: number) {
    console.log('queued step2')
    return this.queue(async () => {
      await delay(d)
      this.data.push('step2')
      console.log('executed step2')
    })
  }

  step3() {
    console.log('queued step3')
    return this.queue(() => {
      // Using params from constructor as context
      this.data.push(`using ctor param: ${this.params.foo}`)
      console.log('executed step3')
    })
  }
}

async function main() {
  console.log('started')

  const chain = new Chainable([], { foo: 'bar' })
  const data = await chain.step1(1000).step2(2000).step3().exec()

  console.log('data: ', data)
}

if (require.main === module) {
  main()
}
```