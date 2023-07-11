import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { loadPic, wait } from './Utils'
import { Picture, Pixel } from './Types'

export class PictureFace implements Face {
  public name = 'Picture'
  public enabled = false
  matrix: LedMatrixInstance
  offset: number = 0
  config: MatrixConfig
  frameNumber = 0

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display(icon: string, duration = 10000) {
    this.matrix.clear()

    console.log(`loading pic ${icon}...`)
    this.frameNumber = 0
    const pictures = await loadPic(icon)

    const picture = pictures[0]
    this.displayPicture(picture)

    if (pictures.length > 1) {
      setTimeout(() => {
        if (this.enabled) {
          this.displayPicture(pictures[this.frameNumber % pictures.length])
          this.matrix.sync()
        }
      }, 0)
    }
    await wait(duration)
  }

  private async displayPicture(picture: Picture) {
    const xOffset = (this.matrix.width() - picture.width) / 2
    const yOffset = (this.matrix.height() - picture.height) / 2
    console.log('pic loaded')

    picture.pixels.forEach((px: Pixel) =>
      this.matrix.fgColor(px.color).setPixel(px.x + xOffset, px.y + yOffset),
    )

    this.frameNumber++

    this.matrix.sync()
  }
}
