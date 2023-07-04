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

  public async display() {
    this.matrix.clear();

    getPixels(
      "./src/icon.png",
      function (
        err: any,
        pixels: {
          shape: string | any[];
          get: (arg0: number, arg1: number, arg2: number) => string;
        }
      ) {
        if (err) {
          console.log("Bad image path");
          return;
        }

        for (let y = 0; y < pixels.shape[1]; y++) {
          for (let x = 0; x < pixels.shape[0]; x++) {
            const r = pixels.get(x, y, 0);
            const g = pixels.get(x, y, 1);
            const b = pixels.get(x, y, 2);
            const rgba = `color: rgba(${r}, ${g}, ${b});`;
            console.log(rgba);
          }
        }

        console.log("got pixels", pixels.shape.slice());
      }
    );

    this.matrix.fgColor(parseInt("0xff0000")).setPixel(0, 0);

    await wait(10000);

    this.matrix.sync();
  }
}
