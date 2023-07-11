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

  public async display(
    icon: string,
    type: 'png' | 'gif' = 'png',
    duration = 10000,
  ) {
    this.matrix.clear()

    console.log(`loading pic ${icon}...`)
    this.frameNumber = 0
    try {
      const pictures = await loadPic(icon, type)

      if (pictures.length > 1) {
        setTimeout(() => {
          if (this.enabled) {
            console.log('show frame number' + this.frameNumber)
            this.displayPicture(pictures[this.frameNumber % pictures.length])
            this.matrix.sync()
          }
        }, 50)
      }

      const picture = pictures[0]
      this.displayPicture(picture)
      await wait(duration)
    } catch (e) {
      console.error('cannot display picture ' + icon)
    }
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
