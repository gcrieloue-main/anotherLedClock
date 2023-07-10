import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { Colors } from './Constants'
import { wait } from './Utils'

export class ColorFace implements Face {
  public name = 'Color'
  public enabled = false
  matrix: LedMatrixInstance
  offset: number = 0
  config: MatrixConfig
  rate = 50
  x = 0
  i = 0

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display(duration = 10000) {
    this.matrix.clear()

    this.matrix.afterSync(() => {
      for (var y = 0; y < 16; y++) {
        this.matrix
          .fgColor(parseInt('0x' + Colors[this.i % Colors.length]))
          .setPixel(this.x, y)
        this.i++
      }
      this.x++

      setTimeout(() => {
        if (this.enabled) {
          this.matrix.sync()
        }
      }, this.rate)
    })

    this.matrix.sync()
    await wait(duration)
  }
}
