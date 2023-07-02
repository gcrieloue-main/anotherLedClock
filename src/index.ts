require("console-stamp")(console, "yyyy/mm/dd HH:MM:ss.l");

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { PulserFace } from "./PulserFace";
import { ClockFace } from "./ClockFace";
import { TextFace } from "./TextFace";

import { matrix } from "./Matrix";

const pulserFace = new PulserFace(matrix);
const clockFace = new ClockFace(matrix);
const textFace = new TextFace(matrix);

const allFaces = [pulserFace, clockFace, textFace];

// ============= Features =============

function showClock() {
  if (!clockFace.enabled) {
    allFaces.forEach((face) => (face.enabled = false));
    clockFace.enabled = true;
    clockFace.display();
  }
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
  await pulse(2000);
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
  var msg = "Text received : " + req.params.text;

  if (!textFace.animationIsOver) {
    msg += ", skipped";
    console.log(msg);
    res.send(msg);
    return;
  }
  res.send(msg);

  allFaces.forEach((face) => (face.enabled = false));
  textFace.enabled = true;

  await textFace.display(req.params.text);
  defaultFace();
});

app.get("/pulse", async (req: Request, res: Response) => {
  const msg = "Pulse";
  console.log(msg);
  res.send(msg);

  await pulse();
  defaultFace();
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
