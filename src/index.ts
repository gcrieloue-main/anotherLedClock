require("console-stamp")(console, "yyyy/mm/dd HH:MM:ss.l");
const listEndpoints = require("express-list-endpoints");

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { PulserFace } from "./PulserFace";
import { ClockFace, ClockStyleEnum } from "./ClockFace";
import { TextFace } from "./TextFace";

import { matrix } from "./Matrix";
import { MatrixConfig } from "./MatrixConfig";
import { ColorFace } from "./ColorFace";
import { CircleFace } from "./CircleFace";
import { PictureFace } from "./PictureFace";
import { RandomFace } from "./RandomFace";
import { VolumeBarsFace } from "./VolumeBarsFace";
import { dir } from "console";

const matrixConfig = new MatrixConfig();
const pulserFace = new PulserFace(matrix);
const clockFace = new ClockFace(matrix, matrixConfig);
const textFace = new TextFace(matrix, matrixConfig);
const colorFace = new ColorFace(matrix, matrixConfig);
const circleFace = new CircleFace(matrix, matrixConfig);
const pictureFace = new PictureFace(matrix, matrixConfig);
const randomFace = new RandomFace(matrix, matrixConfig);
const volumeBarsFace = new VolumeBarsFace(matrix, matrixConfig);

const allFaces: Face[] = [
  pulserFace,
  clockFace,
  textFace,
  circleFace,
  colorFace,
  randomFace,
  volumeBarsFace,
  pictureFace,
];

// ============= Features =============

function stop() {
  matrix
    .clear()
    .afterSync(() => undefined)
    .sync();
}

function switchTheme(theme: string) {
  if (theme == "default") {
    matrixConfig.primaryColor = 0xffffff;
    matrixConfig.secondaryColor = 0x3333ff;
    matrixConfig.alternateColor = 0x1111dd;
  } else if (theme == "orange") {
    matrixConfig.primaryColor = 0xffffff;
    matrixConfig.secondaryColor = 0xffa500;
    matrixConfig.alternateColor = 0xffa500;
  }
}

function showClock(style: ClockStyleEnum = ClockStyleEnum.CLASSIC) {
  clockFace.style = style;
  if (!clockFace.enabled) {
    enableFace(clockFace);
    clockFace.display();
  }
}

const defaultFace = showClock;

function enableFace(face: Face) {
  console.log(`Enable face ${face.name}`);
  allFaces.forEach((face) => (face.enabled = false));
  face.enabled = true;
}

async function runFace(face: Face, fn: (...args: any[]) => Promise<any>) {
  if (!allFaces.includes(face)) {
    console.warn(`all faces array does nort include ${face.name} !`);
    return;
  }

  if (face.enabled) {
    console.log(`Face ${face.name} already enabled`);
    return;
  }

  enableFace(face);

  await fn();
  defaultFace();
}

const runFaceDefault = async (face: SimpleDisplay) => {
  runFace(face, () => face.display());
};

const runFaceDefaultWithDuration = async (
  face: SimpleDisplayWithDuration,
  duration?: number
) => {
  runFace(face, () => face.display(duration));
};

const showPicture = (picture: string) =>
  runFace(pictureFace, () => pictureFace.display(picture));

const text = (txt: string) => runFace(textFace, () => textFace.display(txt));

const circle = (duration?: number) => runFaceDefault(circleFace);

const pulse = (duration?: number) =>
  runFaceDefaultWithDuration(pulserFace, duration);

const colors = (duration?: number) => runFaceDefault(colorFace);

const random = (duration?: number) => runFaceDefaultWithDuration(randomFace);

// ============= Start =============

(async () => {
  matrix.brightness(matrixConfig.brightness);
  pulse(5000);
})();

// ============= API =============

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get("/clock/:style?", async (req: Request, res: Response) => {
  const param: string = req.params.style;
  const style = (param as ClockStyleEnum) || ClockStyleEnum.CLASSIC;
  const msg = "Clock with style " + style;
  console.log(msg);

  showClock(style);
  res.send(msg);
});

app.get("/text/:text", async (req: Request, res: Response) => {
  const txt = req.params.text;
  var msg = "> Text received : " + txt;

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
  const msg = "> Pulse";
  console.log(msg);
  res.send(msg);

  await pulse();
});

app.get("/animation/colors", async (req: Request, res: Response) => {
  const msg = "> Colors";
  console.log(msg);
  res.send(msg);

  await colors();
});

app.get("/animation/circle", async (req: Request, res: Response) => {
  const msg = "> Circle";
  console.log(msg);
  res.send(msg);

  await circle();
});

app.get("/animation/random/:duration?", async (req: Request, res: Response) => {
  const param: string = req.params.duration;
  const duration = parseInt(param) || undefined;

  var msg = "> Random";
  if (duration) {
    msg += " with duration " + duration;
  }

  console.log(msg);
  res.send(msg);

  await random(duration);
});

app.get("/picture/:picture", async (req: Request, res: Response) => {
  const picture = req.params.picture;
  const msg = "> Picture " + picture;
  console.log(msg);
  res.send(msg);

  await showPicture(picture);
});

app.get("/config", async (req: Request, res: Response) => {
  console.log(matrixConfig.config());
  res.send(matrixConfig.config());
});

app.get(
  "/config/brightness/:brightness",
  async (req: Request, res: Response) => {
    const brightness = req.params.brightness;
    const msg = "> Brightness : " + brightness;
    console.log(msg);
    res.send(msg);

    const brightnessNumber = parseInt(brightness, 10);
    matrixConfig.brightness = brightnessNumber;
    matrix.brightness(brightnessNumber).sync();
  }
);

app.get("/config/primary/:primary", async (req: Request, res: Response) => {
  const primary = req.params.primary;
  const msg = "> Primary : " + primary;
  console.log(msg);
  res.send(msg);

  matrixConfig.primaryColor = parseInt(primary);
});

app.get("/config/secondary/:secondary", async (req: Request, res: Response) => {
  const secondary = req.params.secondary;
  const msg = "> Secondary : " + secondary;
  console.log(msg);
  res.send(msg);

  matrixConfig.secondaryColor = parseInt(secondary);
});

app.get("/config/alternate/:alternate", async (req: Request, res: Response) => {
  const alternate = req.params.alternate;
  const msg = "> Alternate : " + alternate;
  console.log(msg);
  res.send(msg);

  matrixConfig.alternateColor = parseInt(alternate);
});

app.get("/config/theme/:theme", async (req: Request, res: Response) => {
  const theme = req.params.theme;
  const msg = "> Theme : " + theme;
  console.log(msg);
  res.send(msg);

  switchTheme(theme);
});

app.get("/stop", async (req: Request, res: Response) => {
  const msg = "> Stop";
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
