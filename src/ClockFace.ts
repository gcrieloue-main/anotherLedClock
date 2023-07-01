import { LedMatrixInstance, Font } from "rpi-led-matrix";

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

  constructor(ledMatrix: LedMatrixInstance) {
    this.matrix = ledMatrix;
  }

  public async display() {
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
      .brightness(20)
      .fgColor(0x000000)
      .fill()
      .fgColor(0xffffff)
      .font(fontTom)
      .drawText(timeStr, 3, 5)
      .fgColor(0x3333ff)
      .font(font4x6)
      .drawText(ampmStr, 23, 5);
  }
}
