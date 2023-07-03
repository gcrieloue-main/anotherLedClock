import { LedMatrixInstance } from "rpi-led-matrix";
import { MatrixConfig } from "./MatrixConfig";
import { Colors } from "./Constants";

export class ColorFace implements Face {
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

    var i = 0;
    for (var x = 0; x < 32; x++) {
      for (var y = 0; y < 16; y++) {
        this.matrix
          .fgColor(parseInt("0x" + Colors[i % Colors.length]))
          .setPixel(x, y);
        i++;
      }
    }

    this.matrix.sync();
  }
}
