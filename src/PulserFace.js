"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulserFace = void 0;
class Pulser {
  x;
  y;
  f;
  constructor(x, y, f) {
    this.x = x;
    this.y = y;
    this.f = f;
  }
  nextColor(t) {
    /** You could easily work position-dependent logic into this expression */
    const brightness = 0xff & Math.max(0, 255 * Math.sin((this.f * t) / 1000));
    return (brightness << 16) | (brightness << 8) | brightness;
  }
}
const wait = (t) => new Promise((ok) => setTimeout(ok, t));
class PulserFace {
  enabled = true;
  matrix;
  constructor(ledMatrix) {
    this.matrix = ledMatrix;
  }
  async display(duration = 10000) {
    const pulsers = [];
    for (let x = 0; x < this.matrix.width(); x++) {
      for (let y = 0; y < this.matrix.height(); y++) {
        pulsers.push(new Pulser(x, y, 5 * Math.random()));
      }
    }
    this.matrix.afterSync((mat, dt, t) => {
      if (this.enabled) {
        pulsers.forEach((pulser) => {
          this.matrix.fgColor(pulser.nextColor(t)).setPixel(pulser.x, pulser.y);
        });
        setTimeout(() => this.matrix.sync(), 0);
      }
    });
    this.matrix.sync();
    await wait(duration);
  }
}
exports.PulserFace = PulserFace;
