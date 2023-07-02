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

function showClock() {
  if (!clockFace.enabled){
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

(async () => {
  clockFace.display();
})();

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get("/text/:text", async (req: Request, res: Response) => {
  const msg = "Text received : " + req.params.text;
  console.log(msg);
  if (!textFace.animationIsOver){
    res.send(msg+", skipped");
    return
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

  allFaces.forEach((face) => (face.enabled = false));
  pulserFace.enabled = true;

  await pulserFace.display();
  defaultFace();
});

app.get("/stop", async (req: Request, res: Response) => {
  const msg = "Stop";
  console.log(msg);
  res.send(msg);

  stop();
});

app.get("/clock", async (req: Request, res: Response) => {
  const msg = "Clock";
  console.log(msg);

  showClock();
  res.send(msg);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
