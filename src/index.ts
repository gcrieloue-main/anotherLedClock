require("console-stamp")(console, "yyyy/mm/dd HH:MM:ss.l");
const listEndpoints = require("express-list-endpoints");

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { PulserFace } from "./PulserFace";
import { ClockFace } from "./ClockFace";
import { TextFace } from "./TextFace";

import { matrix } from "./Matrix";
import { MatrixConfig } from "./MatrixConfig";
import { ColorFace } from "./ColorFace";
import { CircleFace } from "./CircleFace";
import { PictureFace } from "./PictureFace";

const matrixConfig = new MatrixConfig();
const pulserFace = new PulserFace(matrix);
const clockFace = new ClockFace(matrix, matrixConfig);
const textFace = new TextFace(matrix, matrixConfig);
const colorFace = new ColorFace(matrix, matrixConfig);
const circleFace = new CircleFace(matrix, matrixConfig);
const pictureFace = new PictureFace(matrix, matrixConfig);

const allFaces = [pulserFace, clockFace, textFace, circleFace, colorFace];

// ============= Features =============

function showClock() {
  if (!clockFace.enabled) {
    enableFace(clockFace);
    clockFace.display();
  }
}

async function showPicture() {
  enableFace(pictureFace);
  await pictureFace.display();
}

async function text(txt: string) {
  enableFace(textFace);
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

function enableFace(face: Face) {
  allFaces.forEach((face) => (face.enabled = false));
  face.enabled = true;
}

async function circle(duration?: number) {
  enableFace(circleFace);

  await circleFace.display();
}

async function pulse(duration?: number) {
  enableFace(pulserFace);

  await pulserFace.display(duration);
}

async function colors(duration?: number) {
  enableFace(colorFace);

  await colorFace.display();
}

// ============= Start =============

(async () => {
  matrix.brightness(matrixConfig.brightness);
  await pulse(5000);
  defaultFace();
})();

// ============= API =============

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get("/picture", async (req: Request, res: Response) => {
  const msg = "Picture";
  console.log(msg);

  showPicture();
  res.send(msg);
});

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

  console.log(msg);
  res.send(msg);

  await text(txt);
  defaultFace();
});

app.get("/animation/pulse", async (req: Request, res: Response) => {
  const msg = "Pulse";
  console.log(msg);
  res.send(msg);

  if (!pulserFace.enabled) {
    await pulse();
    defaultFace();
  }
});

app.get("/animation/colors", async (req: Request, res: Response) => {
  const msg = "Colors";
  console.log(msg);
  res.send(msg);
  if (!colorFace.enabled) {
    await colors();
  }
});

app.get("/animation/circle", async (req: Request, res: Response) => {
  const msg = "Circle";
  console.log(msg);
  res.send(msg);

  if (!circleFace.enabled) {
    await circle();
    defaultFace();
  }
});

app.get("/config", async (req: Request, res: Response) => {
  console.log(matrixConfig.config());
  res.send(matrixConfig.config());
});

app.get(
  "/config/brightness/:brightness",
  async (req: Request, res: Response) => {
    const brightness = req.params.brightness;
    const msg = "Brightness : " + brightness;
    console.log(msg);
    res.send(msg);

    const brightnessNumber = parseInt(brightness, 10);
    matrixConfig.brightness = brightnessNumber;
    matrix.brightness(brightnessNumber).sync();
  }
);

app.get("/config/primary/:primary", async (req: Request, res: Response) => {
  const primary = req.params.primary;
  const msg = "Primary : " + primary;
  console.log(msg);
  res.send(msg);

  matrixConfig.primaryColor = parseInt(primary);
});

app.get("/config/secondary/:secondary", async (req: Request, res: Response) => {
  const secondary = req.params.secondary;
  const msg = "Secondary : " + secondary;
  console.log(msg);
  res.send(msg);

  matrixConfig.secondaryColor = parseInt(secondary);
});

app.get("/config/alternate/:alternate", async (req: Request, res: Response) => {
  const alternate = req.params.alternate;
  const msg = "Alternate : " + alternate;
  console.log(msg);
  res.send(msg);

  matrixConfig.alternateColor = parseInt(alternate);
});

app.get("/stop", async (req: Request, res: Response) => {
  const msg = "Stop";
  console.log(msg);
  res.send(msg);

  stop();
});

app.get("/endpoints", async (req: Request, res: Response) => {
  res.send(listEndpoints(app));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
