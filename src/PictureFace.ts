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
      "icon.png",
      function (err: any, pixels: { shape: string | any[] }) {
        if (err) {
          console.log("Bad image path");
          return;
        }
        console.log("got pixels", pixels.shape.slice());
      }
    );

    this.matrix.fgColor(parseInt("0xff0000")).setPixel(0, 0);

    await wait(10000);

    this.matrix.sync();
  }
}
