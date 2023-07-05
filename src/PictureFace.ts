import { LedMatrixInstance } from "rpi-led-matrix";
import { MatrixConfig } from "./MatrixConfig";
import { wait } from "./Utils";
var getPixels = require("get-pixels");

interface Pixel {
  x: number;
  y: number;
  color: number;
}

const paddingWithZero = (s: string) => ("00" + s).slice(-2);

export class PictureFace implements Face {
  public name = "Picture";
  public enabled = false;
  matrix: LedMatrixInstance;
  offset: number = 0;
  config: MatrixConfig;

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix;
    this.config = config;
  }

  public async display(icon: string, duration = 10000) {
    this.matrix.clear();

    console.log(`loading pic ${icon}...`);
    const pxs = await this.loadPic(icon);
    console.log("pic loaded");

    pxs.forEach((px: Pixel) =>
      this.matrix.fgColor(px.color).setPixel(px.x, px.y)
    );

    this.matrix.sync();
    await wait(duration);
  }

  public async loadPic(icon: string): Promise<Pixel[]> {
    return new Promise((resolve, reject) => {
      let pxs: Pixel[] = [];
      const xOffset = 8;

      getPixels(
        "./src/icons/" + icon + ".png",
        (
          err: any,
          pixels: {
            shape: string | any[];
            get: (arg0: number, arg1: number, arg2: number) => number;
          }
        ) => {
          if (err) {
            const reason = "Bad image path";
            console.log(reason);
            reject(reason);
          }

          for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
              const r = pixels.get(x, y, 0);
              const g = pixels.get(x, y, 1);
              const b = pixels.get(x, y, 2);
              const color = parseInt(
                `0x${paddingWithZero(r.toString(16))}${paddingWithZero(
                  g.toString(16)
                )}${paddingWithZero(b.toString(16))}`
              );
              pxs.push({ x: x + xOffset, y, color });
            }
          }

          resolve(pxs);
        }
      );
    });
  }
}
