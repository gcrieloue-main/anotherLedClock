import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  Font,
  LedMatrix,
  GpioMapping,
  LedMatrixUtils,
  PixelMapperType,
} from "rpi-led-matrix";

const matrix = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 16,
    cols: 32,
    chainLength: 1,
    hardwareMapping: GpioMapping.Regular,
    pixelMapperConfig: LedMatrixUtils.encodeMappers({
      type: PixelMapperType.U,
    }),
    pwmLsbNanoseconds: 200,
  },
  {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 0,
  }
);

const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));

function formatTime(date: Date) {
  var hours = date.getHours() + 1;
  var minutes = date.getMinutes();
  //var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var strMinutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + strMinutes; //+ " " + ampm;
  return strTime;
}

function formatAMPM(date: Date) {
  var hours = date.getHours() + 1;
  var ampm = hours >= 12 ? "pm" : "am";
  return ampm;
}

//const font = new Font("5x8", "fonts/5x8.bdf");
const font4x6 = new Font("4x6", "fonts/4x6.bdf");
const fontTom = new Font("tom", "fonts/tom-thumb.bdf");
let mode: "CLOCK" | "TEXT" = "CLOCK";

async function displayDate() {
  mode = "CLOCK";
  const time = new Date();
  const timeStr = formatTime(time);
  const ampmStr = formatAMPM(time);
  //console.log("display", timeStr);
  matrix
    .clear() // clear the display
    .brightness(20) // set the panel brightness to 100%
    .fgColor(0x000000) // set the active color to blue
    .fill() // color the entire diplay blue
    .fgColor(0xffffff) // set the active color to yellow
    .font(fontTom)
    .drawText(timeStr, 3, 5)
    .fgColor(0x3333ff) // set the active color to yellow
    .font(font4x6)
    .drawText(ampmStr, 23, 5);
}

async function displayText(text: string) {
  mode = "TEXT";
  matrix.clear().drawText(text, 1, 1);

  await wait(10000);
  mode = "CLOCK";
}

(async () => {
  displayDate();

  matrix.afterSync((mat, dt, t) => {
    if (mode === "CLOCK") {
      displayDate();
    }
    setTimeout(() => matrix.sync(), 10000);
  });

  matrix.sync();

  await wait(20000);

  displayText("TEST");
  matrix.sync();
})();

/********/

class Pulser {
  constructor(readonly x: number, readonly y: number, readonly f: number) {}

  nextColor(t: number): number {
    /** You could easily work position-dependent logic into this expression */
    const brightness = 0xff & Math.max(0, 255 * Math.sin((this.f * t) / 1000));

    return (brightness << 16) | (brightness << 8) | brightness;
  }
}

async function pulse() {
  const pulsers: Pulser[] = [];

  for (let x = 0; x < matrix.width(); x++) {
    for (let y = 0; y < matrix.height(); y++) {
      pulsers.push(new Pulser(x, y, 5 * Math.random()));
    }
  }

  matrix.afterSync((mat, dt, t) => {
    pulsers.forEach((pulser) => {
      matrix.fgColor(pulser.nextColor(t)).setPixel(pulser.x, pulser.y);
    });

    setTimeout(() => matrix.sync(), 0);
  });

  await wait(30000);
}

/*******/

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get("/text/:text", (req: Request, res: Response) => {
  const msg = "Text received" + req.params.text;
  console.log(msg);
  displayText(req.params.text);
  matrix.sync();
  res.send(msg);
});

app.get("/pulse", (req: Request, res: Response) => {
  const msg = "Pulse";
  console.log(msg);
  pulse();
  matrix.sync();
  res.send(msg);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
