import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { Colors } from './Constants'

const wait = (t: number) => new Promise(ok => setTimeout(ok, t))

export class CircleFace implements Face {
  name = 'Circle'
  enabled = false
  matrix: LedMatrixInstance
  config: MatrixConfig
  private rate = 50

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display(duration = 10000) {
    this.matrix.clear()

    const circles: { color: number; r: number }[] = []

    var i = 0
    this.matrix.afterSync(() => {
      if (circles.length > 15) {
        circles.shift()
      }
      const newCircle = {
        color: parseInt('0x' + Colors[i % Colors.length]),
        r: 0,
      }
      i++
      circles.push(newCircle)

      for (var circle of circles) {
        circle.r++
        this.matrix
          .fgColor(circle.color)
          .drawCircle(
            this.matrix.width() / 2,
            this.matrix.height() / 2,
            circle.r,
          )
      }
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
