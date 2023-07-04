import { LedMatrixInstance } from "rpi-led-matrix";
import { MatrixConfig } from "./MatrixConfig";
import { wait } from "./Utils";
var getPixels = require("get-pixels");

export class PictureFace implements Face {
  public enabled = true;
  matrix: LedMatrixInstance;
  offset: number = 0;
  config: MatrixConfig;

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix;
    this.config = config;
  }

  public async display(icon: string) {
    this.matrix.clear();

    const pxs = this.loadPic(icon);

    pxs.forEach((px) => this.matrix.fgColor(px.color).setPixel(px.x, px.y));

    this.matrix.sync();
    await wait(10000);
  }

  public loadPic(icon: string) {
    let pxs: { x: number; y: number; color: number }[] = [];

    getPixels(
      "./src/" + icon + ".png",
      (
        err: any,
        pixels: {
          shape: string | any[];
          get: (arg0: number, arg1: number, arg2: number) => number;
        }
      ) => {
        if (err) {
          console.log("Bad image path");
          return;
        }

        for (let y = 0; y < 16; y++) {
          for (let x = 0; x < 16; x++) {
            const r = pixels.get(x, y, 0);
            const g = pixels.get(x, y, 1);
            const b = pixels.get(x, y, 2);
            pxs.push({
              x,
              y,
              color: parseInt(
                `0x${r.toString(16)}${g.toString(16)}${b.toString(16)}`
              ),
            });
          }
        }
      }
    );

    return pxs;
  }
}
