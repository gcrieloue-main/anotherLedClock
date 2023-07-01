import { LedMatrixInstance, Font } from "rpi-led-matrix";

const font4x6 = new Font("4x6", "fonts/4x6.bdf");

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));

export class TextFace {
  matrix: LedMatrixInstance;

  constructor(ledMatrix: LedMatrixInstance) {
    this.matrix = ledMatrix;
  }

  public async display(text: string) {
    const w = this.matrix.width();
    const stringWidth = font4x6.stringWidth(text);
    const words = text.split(" ");

    if (stringWidth < w) {
      this.simpleDisplay(text);
    } else if (
      stringWidth < w * 2 &&
      words.every((word) => font4x6.stringWidth(word) < w)
    ) {
      this.twoLineDisplay(text);
    } else {
      this.scrollingDisplay(text);
    }

    this.matrix.afterSync(() => {}).sync();

    await wait(10000);
  }

  public simpleDisplay(text: string) {
    const w = this.matrix.width();
    const h = this.matrix.height();

    const stringWidth = font4x6.stringWidth(text);
    const fontHeight = font4x6.baseline();

    this.matrix
      .clear()
      .font(font4x6)
      .drawText(text, w / 2 - stringWidth / 2, h / 2 - fontHeight / 2);
  }

  public twoLineDisplay(text: string) {
    const w = this.matrix.width();
    const fontHeight = font4x6.baseline();
    const words = text.split(" ");
    var firstLine = "";
    var secondLine = "";
    words.every((word) => {
      var toAdd = "";
      if (firstLine.length == 0) {
        toAdd = firstLine += word;
      } else {
        toAdd += " " + word;
      }

      if (font4x6.stringWidth(firstLine + toAdd) < w) {
        firstLine += toAdd;
      } else {
        secondLine += toAdd;
      }
    });

    this.matrix
      .clear()
      .font(font4x6)
      .drawText(firstLine, 0, 0)
      .drawText(secondLine, 0, fontHeight + 1);
  }

  public scrollingDisplay(text: string) {
    this.simpleDisplay(text);
  }
}
