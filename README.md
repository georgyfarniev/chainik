# chainik

<a href="https://www.npmjs.com/package/chainik" alt="Downloads">
  <img src="https://img.shields.io/npm/dm/chainik" />
</a>

<a href="https://www.npmjs.com/package/chainik">
  <img src="https://img.shields.io/npm/v/chainik" />
</a>

## Motivation
Simple helper for building async chainable classes without external dependencies

**Chainik** means **teapot** in Russian. I took this name because it associated with chains and
**cantik**, which means **beautiful** in Indonesian and some other languages. Also, other names
containing **chain** word and suitable for this module was occupied in NPM.

## Features
 - Typescript types out of the box
 - No external dependencies
 - Works in browser and node
 - Simple
 
## Installation
```shell
npm i -g chainik
```

## For usage, see example below (more examples and documentation coming soon!):

```ts
import Chainik from 'chainik'

const delay = (t: number) => new Promise(r => setTimeout(r, t))

type Data = string[]
type Params = { foo: string }

class Chainable extends Chainik<Data, Params> {
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