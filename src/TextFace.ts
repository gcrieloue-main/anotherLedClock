import { LedMatrixInstance, Font } from "rpi-led-matrix";

const font4x6 = new Font("4x6", "fonts/4x6.bdf");

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));

export class TextFace {
  matrix: LedMatrixInstance;
  offset: number = 0;

  constructor(ledMatrix: LedMatrixInstance) {
    this.matrix = ledMatrix;
  }

  public async display(textToDisplay: string) {
    const text = textToDisplay.trim();

    const w = this.matrix.width();
    const stringWidth = font4x6.stringWidth(text);

    this.matrix
      .font(font4x6)
      .afterSync(() => {})
      .sync();

    if (stringWidth < w) {
      this.simpleDisplay(text);
    } else {
      const { firstLine, secondLine } = this.computeTwoLines(text);
      if (
        font4x6.stringWidth(firstLine) < w &&
        font4x6.stringWidth(secondLine) < w
      ) {
        this.twoLineDisplay(firstLine, secondLine);
      } else {
        this.scrollingDisplay(text);
      }
    }

    await wait(10000);
  }

  public simpleDisplay(text: string) {
    const w = this.matrix.width();
    const h = this.matrix.height();

    const stringWidth = font4x6.stringWidth(text);
    const fontHeight = font4x6.baseline();

    this.matrix
      .clear()
      .drawText(text, w / 2 - stringWidth / 2, h / 2 - fontHeight / 2);
  }

  public computeTwoLines(text: string): {
    firstLine: string;
    secondLine: string;
  } {
    const w = this.matrix.width();
    const words = text.split(" ");
    var firstLine: string = "";
    var secondLine: string = "";

    var firstLineFull = false;
    words.forEach((word) => {
      var toAdd = "";
      if (firstLine.length == 0) {
        toAdd += word;
      } else {
        toAdd += " " + word;
      }

      if (font4x6.stringWidth(firstLine + toAdd) < w && !firstLineFull) {
        firstLine += toAdd;
      } else {
        firstLineFull = true;
        secondLine += toAdd;
      }
    });

    secondLine = secondLine.trim();

    return { firstLine, secondLine };
  }

  public twoLineDisplay(firstLine: string, secondLine: string) {
    const h = this.matrix.height();
    const fontHeight = font4x6.baseline();

    const textZoneHeight = 2 * fontHeight + 1;
    this.matrix
      .clear()
      .drawText(firstLine, 0, (h - textZoneHeight) / 2)
      .drawText(secondLine, 0, (h - textZoneHeight) / 2 + textZoneHeight / 2);
  }

  public scrollingDisplay(text: string) {
    const w = this.matrix.width();
    this.offset = w;

    this.scrollingDisplayText(text);

    this.matrix
      .afterSync((mat: LedMatrixInstance, dt: number) => {
        console.log(this.offset, dt);

        const stringWidth = font4x6.stringWidth(text);
        if (this.offset > -stringWidth) {
          this.offset--;
          this.scrollingDisplayText(text);
          setTimeout(() => this.matrix.sync(), 200);
        }
      })
      .sync();
  }

  public scrollingDisplayText(text: string) {
    const h = this.matrix.height();
    const fontHeight = font4x6.baseline();

    this.matrix.clear().drawText(text, this.offset, h / 2 - fontHeight / 2);
  }
}
