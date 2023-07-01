import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  LedMatrix,
  GpioMapping,
  LedMatrixUtils,
  PixelMapperType,
} from "rpi-led-matrix";

import { PulserFace } from "./PulserFace";
import { ClockFace } from "./ClockFace";
import { TextFace } from "./TextFace";

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

const pulserFace = new PulserFace(matrix);
const clockFace = new ClockFace(matrix);
const textFace = new TextFace(matrix);

// let mode: "CLOCK" | "TEXT" = "CLOCK";

(async () => {
  clockFace.display();
})();

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get("/text/:text", (req: Request, res: Response) => {
  const msg = "Text received : " + req.params.text;
  console.log(msg);
  textFace.display(req.params.text);
  matrix.sync();
  res.send(msg);
});

app.get("/pulse", (req: Request, res: Response) => {
  const msg = "Pulse";
  console.log(msg);
  pulserFace.display();
  res.send(msg);
});

app.get("/stop", (req: Request, res: Response) => {
  const msg = "Stop";
  console.log(msg);
  matrix
    .clear()
    .afterSync(() => {})
    .sync();
  res.send(msg);
});

app.get("/clock", (req: Request, res: Response) => {
  const msg = "Clock";
  console.log(msg);
  clockFace.display();
  res.send(msg);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
