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

export class ClockFace {
  matrix: LedMatrixInstance;
  public enabled = true;
  config: MatrixConfig;

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix;
    this.config = config;
  }

  public async display() {
    console.log("display clock");
    this.displayClock();

    this.matrix.afterSync((mat: LedMatrixInstance, dt: number, t: number) => {
      setTimeout(() => {
        if (this.enabled) {
          this.displayClock();
          this.matrix.sync();
        } else {
          console.log("skip clock");
        }
      }, 10000);
    });

    this.matrix.sync();
  }

  public async displayClock() {
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
      .drawText(timeStr, 3, 5)
      .fgColor(this.config.secondaryColor)
      .font(font4x6)
      .drawText(ampmStr, 23, 5);
  }
}
