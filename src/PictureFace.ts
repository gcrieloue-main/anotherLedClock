import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { loadPic, wait } from './Utils'
import { Pixel } from './Types'

export class PictureFace implements Face {
  public name = 'Picture'
  public enabled = false
  matrix: LedMatrixInstance
  offset: number = 0
  config: MatrixConfig

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display(icon: string, duration = 10000) {
    this.matrix.clear()

    console.log(`loading pic ${icon}...`)
    const pictures = await loadPic(icon)
    const picture = pictures[0]

    const xOffset = (this.matrix.width() - picture.width) / 2
    console.log('pic loaded')

    picture.pixels.forEach((px: Pixel) =>
      this.matrix.fgColor(px.color).setPixel(px.x + xOffset, px.y),
    )

    this.matrix.sync()
    await wait(duration)
  }
}
