"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockFace = void 0;
const rpi_led_matrix_1 = require("rpi-led-matrix");
const font4x6 = new rpi_led_matrix_1.Font("4x6", "fonts/4x6.bdf");
const fontTom = new rpi_led_matrix_1.Font("tom", "fonts/tom-thumb.bdf");
function formatTime(date) {
  var hours = date.getHours() + 1;
  var minutes = date.getMinutes();
  //var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var strMinutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + strMinutes; //+ " " + ampm;
  return strTime;
}
function formatAMPM(date) {
  var hours = date.getHours() + 1;
  var ampm = hours >= 12 ? "pm" : "am";
  return ampm;
}
class ClockFace {
  matrix;
  enabled = true;
  config;
  constructor(ledMatrix, config) {
    this.matrix = ledMatrix;
    this.config = config;
  }
  async display() {
    console.log("display clock");
    this.displayClock();
    this.matrix.afterSync((mat, dt, t) => {
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
  async displayClock() {
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
      .fgColor(this.config.alternateColor)
      //  .drawRect(0, 0, this.matrix.width() - 1, 1)
      .drawRect(0, this.matrix.height() - 2, this.matrix.width() - 1, 1)
      .fgColor(this.config.secondaryColor)
      .font(font4x6)
      .drawText(ampmStr, 23, 5);
  }
}
exports.ClockFace = ClockFace;
