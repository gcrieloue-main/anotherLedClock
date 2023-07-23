import { LedMatrixInstance } from 'rpi-led-matrix'
import { wait } from './Utils'

export class RainFace implements Face {
  public name = 'Rain'
  public enabled = false
  matrix: LedMatrixInstance

  constructor(ledMatrix: LedMatrixInstance) {
    this.matrix = ledMatrix
  }

  public async display(duration: number = 10000) {
    this.matrix.afterSync((mat: LedMatrixInstance, dt: number, t: number) => {
      if (this.enabled) {
        setTimeout(() => {
          if (this.enabled) {
            this.matrix.sync()
          }
        }, 0)
      }
    })

    this.matrix.sync()

    await wait(duration)
  }
}
