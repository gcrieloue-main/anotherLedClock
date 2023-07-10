import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { Colors } from './Constants'
import { randomElement, wait } from './Utils'

interface Arrow {
  x: number
  color: number
}

export class ArrowFace implements Face {
  name = 'Arrow'
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
      const squareSideSize = this.matrix.height() / 2
      for (var arrow of this.arrows) {
        this.matrix
          .fgColor(arrow.color)
          .drawLine(arrow.x, 0, arrow.x + squareSideSize / 2, squareSideSize)
        this.matrix
          .fgColor(arrow.color)
          .drawLine(
            arrow.x,
            squareSideSize,
            arrow.x + squareSideSize / 2,
            squareSideSize,
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
