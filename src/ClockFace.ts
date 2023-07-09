import { LedMatrixInstance, Font } from "rpi-led-matrix";
import { MatrixConfig } from "./MatrixConfig";

const font4x6 = new Font("4x6", "fonts/4x6.bdf");
const fontTom = new Font("tom", "fonts/tom-thumb.bdf");

function formatTime(date: Date) {
  var hours = date.getHours() + 1;
  var minutes = date.getMinutes();
  //var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var strMinutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + strMinutes; //+ " " + ampm;
  return strTime;
}

function formatAMPM(date: Date) {
  var hours = date.getHours() + 1;
  var ampm = hours >= 12 ? "pm" : "am";
  return ampm;
}

export enum ClockStyleEnum {
  BORDER = "BORDER",
  CLASSIC = "CLASSIC",
}

export class ClockFace implements Face {
  public name = "Clock";
  matrix: LedMatrixInstance;
  public enabled = false;
  config: MatrixConfig;
  public style = ClockStyleEnum.CLASSIC;

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix;
    this.config = config;
  }

  public async display() {
    this.displayClock();

    this.matrix.afterSync((mat: LedMatrixInstance, dt: number, t: number) => {
      setTimeout(() => {
        if (this.enabled) {
          this.displayClock();
          this.matrix.sync();
        }
      }, 10000);
    });

    this.matrix.sync();
  }

  private async displayClock() {
    const time = new Date();
    const timeStr = formatTime(time);
    const ampmStr = formatAMPM(time);
    //console.log("display", timeStr);
    this.matrix
      .clear()
      .fgColor(0x000000)
      .fill()
      .fgColor(this.config.primaryColor)
      .font(fontTom)
      .drawText(timeStr, time.getHours().toString().length > 1 ? 2 : 3, 5);

    if (this.style == ClockStyleEnum.CLASSIC) {
      this.matrix
        .fgColor(this.config.alternateColor)
        .drawRect(0, this.matrix.height() - 2, this.matrix.width() - 1, 1);
    } else if (this.style == ClockStyleEnum.BORDER) {
      this.matrix
        .fgColor(this.config.alternateColor)
        .drawRect(0, 0, this.matrix.width() - 1, this.matrix.height() - 1)
        .fgColor(parseInt("0x000000"))
        .setPixel(0, 0)
        .setPixel(0, this.matrix.height() - 1)
        .setPixel(this.matrix.width() - 1, 0)
        .setPixel(this.matrix.width() - 1, this.matrix.height() - 1);
    }

    this.matrix
      .fgColor(this.config.secondaryColor)
      .font(font4x6)
      .drawText(ampmStr, 23, 5);
  }
}
