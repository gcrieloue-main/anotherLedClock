import { LedMatrixInstance } from "rpi-led-matrix";
import { MatrixConfig } from "./MatrixConfig";
import { Colors } from "./Constants";

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));

const randomBoolean = () => Math.random() < 0.5;

const randomElement = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

interface VolumeBar {
  x: number;
  level: number;
}

export class VolumeBarsFace implements Face {
  public name = "VolumeBars";
  public enabled = false;
  matrix: LedMatrixInstance;
  config: MatrixConfig;
  volumeBars: VolumeBar[] = [];

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix;
    this.config = config;
  }

  public async display(duration = 10000) {
    this.volumeBars = [];
    this.matrix.clear();

    this.volumeBars.push({ x: 0, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 2, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 4, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 6, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 8, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 10, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 12, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 14, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 16, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 18, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 20, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 22, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 24, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 26, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 28, level: randomIntFromInterval(0, 15) });
    this.volumeBars.push({ x: 30, level: randomIntFromInterval(0, 15) });

    this.matrix.afterSync(() => {
      this.matrix.clear();

      const color: number = parseInt("0x" + randomElement(Colors));
      this.volumeBars.forEach((bar) => {
        if (randomBoolean() && bar.level < 15) {
          bar.level++;
        } else {
          bar.level--;
        }
        for (var y = 0; y < bar.level; y++) {
          this.matrix
            .fgColor(color)
            .drawRect(bar.x, this.matrix.height - y, 1, 0);
        }
      });
      setTimeout(() => {
        if (this.enabled) {
          this.matrix.sync();
        }
      }, 50);
    });

    this.matrix.sync();

    await wait(duration);
  }
}
