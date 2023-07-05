import { LedMatrixInstance } from "rpi-led-matrix";
import { wait } from "./Utils";

class Pulser {
  constructor(readonly x: number, readonly y: number, readonly f: number) {}

  nextColor(t: number): number {
    const brightness = 0xff & Math.max(0, 255 * Math.sin((this.f * t) / 1000));

    return (brightness << 16) | (brightness << 8) | brightness;
  }
}

export class PulserFace implements Face {
  public name = "Pulser";
  public enabled = false;
  matrix: LedMatrixInstance;

  constructor(ledMatrix: LedMatrixInstance) {
    this.matrix = ledMatrix;
  }

  public async display(duration: number = 10000) {
    const pulsers: Pulser[] = [];

    for (let x = 0; x < this.matrix.width(); x++) {
      for (let y = 0; y < this.matrix.height(); y++) {
        pulsers.push(new Pulser(x, y, 5 * Math.random()));
      }
    }

    this.matrix.afterSync((mat: LedMatrixInstance, dt: number, t: number) => {
      if (this.enabled) {
        pulsers.forEach((pulser) => {
          this.matrix.fgColor(pulser.nextColor(t)).setPixel(pulser.x, pulser.y);
        });

        setTimeout(() => {
          if (this.enabled) {
            this.matrix.sync();
          }
        }, 0);
      }
    });

    this.matrix.sync();

    await wait(duration);
  }
}
