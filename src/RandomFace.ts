import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { Colors } from './Constants'

const wait = (t: number) => new Promise(ok => setTimeout(ok, t))

const randomElement = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)]

const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export class RandomFace implements Face {
  public name = 'Random'
  public enabled = false
  matrix: LedMatrixInstance
  config: MatrixConfig

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display(duration = 10000) {
    this.matrix.clear()

    this.matrix.afterSync(() => {
      const x: number = randomIntFromInterval(0, 31)
      const y: number = randomIntFromInterval(0, 15)
      const color: number = parseInt('0x' + randomElement(Colors))

      this.matrix.fgColor(color).drawRect(x, y, 1, 1)

      setTimeout(() => {
        if (this.enabled) {
          this.matrix.sync()
        }
      }, 50)
    })

    this.matrix.sync()

    await wait(duration)
  }
}
