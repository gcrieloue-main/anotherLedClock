import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { Colors } from './Constants'
import { wait } from './Utils'

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
  private switchColorIndex = 0
  private switchColorAfterX = 2
  private currentColor: number
  private colorIndex = 0

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
    this.currentColor = parseInt('0x' + Colors[this.colorIndex % Colors.length])
  }

  public async display(duration = 10000) {
    this.arrows = []
    this.matrix.clear()

    this.matrix.afterSync(() => {
      if (this.switchColorIndex % this.switchColorAfterX == 0) {
        this.currentColor = parseInt(
          '0x' + Colors[this.colorIndex % Colors.length],
        )
        this.colorIndex++
      }
      this.switchColorIndex++

      const squareSideSize = this.matrix.height() / 2
      this.arrows.push({
        x: -squareSideSize,
        color: this.currentColor,
      })
      for (var arrow of this.arrows) {
        this.matrix
          .fgColor(arrow.color)
          .drawLine(arrow.x, 0, arrow.x + squareSideSize, squareSideSize)
        this.matrix
          .fgColor(arrow.color)
          .drawLine(
            arrow.x,
            this.matrix.height(),
            arrow.x + squareSideSize,
            squareSideSize,
          )
        arrow.x++
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
