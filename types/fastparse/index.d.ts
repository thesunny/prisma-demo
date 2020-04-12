declare module "fastparse" {
  // export default function Parser(object: any): void
  export default class Parser<T> {
    constructor(arg: {
      [key: string]: {
        [key: string]: string | ((this: T, ...args: string[]) => void)
      }
    })

    parse(initialState: string, code: string, that: T): this & T
  }
}
