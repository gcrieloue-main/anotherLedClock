import { LedMatrixInstance } from "rpi-led-matrix";
import { MatrixConfig } from "./MatrixConfig";

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));

const randomBoolean = () => Math.random() < 0.5;

const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

interface VolumeBar {
  x: number;
  level: number;
}

export class VolumeBarsFace implements Face {
  name = "VolumeBars";
  enabled = false;
  private matrix: LedMatrixInstance;
  config: MatrixConfig;
  private volumeBars: VolumeBar[] = [];
  private refreshRate = 50;

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix;
    this.config = config;
  }

  public async display(duration = 10000) {
    const colors = [
      "#2dfe00",
      "19d540",
      "14ff00",
      "19d540",
      "7cd42f",
      "e3c50f",
      "ced70e",
      "f7ff05",
      "fbff00",
      "c9c23a",
      "d69014",
      "de9a0b",
      "bf0707",
      "d10b0b",
      "ff0000",
    ];

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

      this.volumeBars.forEach((bar) => {
        if (randomBoolean() && bar.level < 100) {
          bar.level++;
        } else if (bar.level > 0) {
          bar.level--;
        }
        for (var y = 0; y < bar.level; y++) {
          this.matrix
            .fgColor(parseInt(")x" + colors[bar.level]))
            .drawRect(bar.x, this.matrix.height() - y, 1, 0);
        }
      });
      setTimeout(() => {
        if (this.enabled) {
          this.matrix.sync();
        }
      }, this.refreshRate);
    });

    this.matrix.sync();

    await wait(duration);
  }
}
