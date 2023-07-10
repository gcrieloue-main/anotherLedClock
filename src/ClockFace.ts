import { LedMatrixInstance, Font } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { paddingWithZero } from './Utils'

const font4x6 = new Font('4x6', 'fonts/4x6.bdf')
const fontTom = new Font('tom', 'fonts/tom-thumb.bdf')

export enum ClockStyleEnum {
  BORDER = 'BORDER',
  CLASSIC = 'CLASSIC',
  TWENTY_FOUR = 'TWENTY_FOUR',
}

export class ClockFace implements Face {
  public name = 'Clock'
  matrix: LedMatrixInstance
  public enabled = false
  config: MatrixConfig
  public style = ClockStyleEnum.CLASSIC
  private dotDisplayed = true
  private rate = 1000

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display() {
    this.displayClock()

    this.matrix.afterSync((mat: LedMatrixInstance, dt: number, t: number) => {
      setTimeout(() => {
        if (this.enabled) {
          this.displayClock()
          this.matrix.sync()
        }
      }, this.rate)
    })

    this.matrix.sync()
  }

  private displayAmpPmClock() {
    const time = new Date()
    const timeStr = this.format12Time(time)
    const ampmStr = this.formatAMPM(time)

    this.matrix
      .clear()
      .fgColor(this.config.primaryColor)
      .font(fontTom)
      .drawText(timeStr, (time.getHours() + 1) % 12 > 9 ? 2 : 3, 5)
    this.matrix
      .fgColor(this.config.secondaryColor)
      .font(font4x6)
      .drawText(ampmStr, 23, 5)
  }

  private display24Clock() {
    const date = new Date()
    var timeStr = this.format24Time(date)

    this.matrix
      .clear()
      .fgColor(this.config.alternateColor)
      .fill()
      .fgColor(0)
      .font(fontTom)
      .drawText(
        timeStr,
        (this.matrix.width() - fontTom.stringWidth(timeStr)) / 2,
        5,
      )
  }

  private async displayClock() {
    if (this.style == ClockStyleEnum.CLASSIC) {
      this.displayAmpPmClock()

      this.matrix
        .fgColor(this.config.alternateColor)
        .drawRect(0, this.matrix.height() - 2, this.matrix.width() - 1, 1)
    } else if (this.style == ClockStyleEnum.BORDER) {
      this.displayAmpPmClock()

      this.matrix
        .fgColor(this.config.alternateColor)
        .drawRect(0, 0, this.matrix.width() - 1, this.matrix.height() - 1)
        .fgColor(parseInt('0x000000'))
        .setPixel(0, 0)
        .setPixel(0, this.matrix.height() - 1)
        .setPixel(this.matrix.width() - 1, 0)
        .setPixel(this.matrix.width() - 1, this.matrix.height() - 1)
    } else if (this.style == ClockStyleEnum.TWENTY_FOUR) {
      this.display24Clock()
    }

    this.dotDisplayed = !this.dotDisplayed
  }

  private format12Time(date: Date) {
    var hours = date.getHours() + 1
    var minutes = date.getMinutes()
    //var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    var strMinutes = paddingWithZero(minutes.toString())
    var strTime = hours + (this.dotDisplayed ? ':' : ' ') + strMinutes //+ " " + ampm;
    return strTime
  }

  private format24Time(date: Date) {
    var hours = date.getHours() + 1
    var minutes = date.getMinutes()
    var strHours = paddingWithZero(hours.toString())
    var strMinutes = paddingWithZero(minutes.toString())
    return strHours + (this.dotDisplayed ? ':' : ' ') + strMinutes
  }

  private formatAMPM(date: Date) {
    var hours = date.getHours() + 1
    var ampm = hours >= 12 && hours != 24 ? 'pm' : 'am'
    return ampm
  }
}
