import {
    LedMatrix,
  } from "rpi-led-matrix";

class Pulser {
    constructor(readonly x: number, readonly y: number, readonly f: number) {}
  
    nextColor(t: number): number {
      /** You could easily work position-dependent logic into this expression */
      const brightness = 0xff & Math.max(0, 255 * Math.sin((this.f * t) / 1000));
  
      return (brightness << 16) | (brightness << 8) | brightness;
    }
  }

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));


export class PulserFace {

    matrix: LedMatrix
  
    constructor(ledMatrix:LedMatrix){
        this.matrix = ledMatrix;
    }

     public async display() {
        const pulsers: Pulser[] = [];
      
        for (let x = 0; x < this.matrix.width(); x++) {
          for (let y = 0; y < this.matrix.height(); y++) {
            pulsers.push(new Pulser(x, y, 5 * Math.random()));
          }
        }
      
        this.matrix.afterSync((mat, dt, t) => {
          pulsers.forEach((pulser) => {
            this.matrix.fgColor(pulser.nextColor(t)).setPixel(pulser.x, pulser.y);
          });
      
          setTimeout(() => this.matrix.sync(), 0);
        });
      
        this.matrix.sync();

        await wait(30000);
      }
}
