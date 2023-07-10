import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { Colors } from './Constants'
import { randomElement } from './Utils'

interface Arrow {
  x: number
  color: number
}

export class ArrowFace implements Face {
  name = 'Random'
  enabled = false
  matrix: LedMatrixInstance
  config: MatrixConfig
  private rate = 50
  private arrows: Arrow[] = []

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display(duration = 10000) {
    this.arrows = []
    this.matrix.clear()

    this.matrix.afterSync(() => {
      this.arrows.push({ x: 32, color: parseInt('0x' + randomElement(Colors)) })
      for (var arrow of this.arrows) {
        this.matrix
          .fgColor(arrow.color)
          .drawLine(
            arrow.x,
            0,
            arrow.x + this.matrix.height(),
            this.matrix.height() / 2,
          )
        this.matrix
          .fgColor(arrow.color)
          .drawLine(
            arrow.x,
            this.matrix.height(),
            arrow.x + this.matrix.height() / 2,
            this.matrix.height() / 2,
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
