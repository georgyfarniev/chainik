import Chaining from '.'

const delay = (t: number) => new Promise(r => setTimeout(r, t))

type Data = string[]
type Params = { foo: string }

class Chainable extends Chaining<Data, Params> {
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