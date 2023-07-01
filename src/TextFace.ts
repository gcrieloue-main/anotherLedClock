import { LedMatrixInstance, Font } from "rpi-led-matrix";

const font4x6 = new Font("4x6", "fonts/4x6.bdf");

export class TextFace {
  matrix: LedMatrixInstance;

  constructor(ledMatrix: LedMatrixInstance) {
    this.matrix = ledMatrix;
  }

  public async display(text: string) {
    const w = this.matrix.width();
    //const h = this.matrix.height();
    const fontWidth = font4x6.stringWidth(text);
    this.matrix
      .clear()
      .font(font4x6)
      .drawText(text, w / 2 - fontWidth / 2, 1);
  }
}
