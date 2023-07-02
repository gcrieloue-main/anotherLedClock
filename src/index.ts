require("console-stamp")(console, "yyyy/mm/dd HH:MM:ss.l");

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { PulserFace } from "./PulserFace";
import { ClockFace } from "./ClockFace";
import { TextFace } from "./TextFace";

import { matrix } from "./Matrix";
import { MatrixConfig } from "./MatrixConfig";

const matrixConfig = new MatrixConfig();
const pulserFace = new PulserFace(matrix);
const clockFace = new ClockFace(matrix, matrixConfig);
const textFace = new TextFace(matrix, matrixConfig);

const allFaces = [pulserFace, clockFace, textFace];

// ============= Features =============

function showClock() {
  if (!clockFace.enabled) {
    allFaces.forEach((face) => (face.enabled = false));
    clockFace.enabled = true;
    clockFace.display();
  }
}

async function text(txt: string) {
  allFaces.forEach((face) => (face.enabled = false));
  textFace.enabled = true;

  await textFace.display(txt);
}

function stop() {
  matrix
    .clear()
    .afterSync(() => {})
    .sync();
}

function defaultFace() {
  showClock();
}

async function pulse(duration?: number) {
  allFaces.forEach((face) => (face.enabled = false));
  pulserFace.enabled = true;

  await pulserFace.display(duration);
}

// ============= Start =============

(async () => {
  matrix.brightness(30);
  await pulse(5000);
  defaultFace();
})();

// ============= API =============

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get("/clock", async (req: Request, res: Response) => {
  const msg = "Clock";
  console.log(msg);

  showClock();
  res.send(msg);
});

app.get("/text/:text", async (req: Request, res: Response) => {
  const txt = req.params.text;
  var msg = "Text received : " + txt;

  if (!textFace.animationIsOver) {
    msg += ", skipped";
    console.log(msg);
    res.send(msg);
    return;
  }
  res.send(msg);

  await text(txt);
  defaultFace();
});

app.get("/pulse", async (req: Request, res: Response) => {
  const msg = "Pulse";
  console.log(msg);
  res.send(msg);

  await pulse();
  defaultFace();
});

app.get("/brightness/:brightness", async (req: Request, res: Response) => {
  const brightness = req.params.brightness;
  const msg = "Brightness : " + brightness;
  console.log(msg);
  res.send(msg);

  matrix.brightness(parseInt(brightness, 10)).sync();
});

app.get("/config/primary/:primary", async (req: Request, res: Response) => {
  const primary = req.params.primary;
  const msg = "Primary : " + primary;
  console.log(msg);
  res.send(msg);

  matrixConfig.primaryColor = parseInt(primary);
});

app.get("/stop", async (req: Request, res: Response) => {
  const msg = "Stop";
  console.log(msg);
  res.send(msg);

  stop();
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
