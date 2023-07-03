"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
require("console-stamp")(console, "yyyy/mm/dd HH:MM:ss.l");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const PulserFace_1 = require("./PulserFace");
const ClockFace_1 = require("./ClockFace");
const TextFace_1 = require("./TextFace");
const Matrix_1 = require("./Matrix");
const MatrixConfig_1 = require("./MatrixConfig");
const ColorFace_1 = require("./ColorFace");
const matrixConfig = new MatrixConfig_1.MatrixConfig();
const pulserFace = new PulserFace_1.PulserFace(Matrix_1.matrix);
const clockFace = new ClockFace_1.ClockFace(Matrix_1.matrix, matrixConfig);
const textFace = new TextFace_1.TextFace(Matrix_1.matrix, matrixConfig);
const colorFace = new ColorFace_1.ColorFace(Matrix_1.matrix, matrixConfig);
const allFaces = [pulserFace, clockFace, textFace];
// ============= Features =============
function showClock() {
  if (!clockFace.enabled) {
    enableFace(clockFace);
    clockFace.display();
  }
}
async function text(txt) {
  enableFace(textFace);
  await textFace.display(txt);
}
function stop() {
  Matrix_1.matrix
    .clear()
    .afterSync(() => {})
    .sync();
}
function defaultFace() {
  showClock();
}
function enableFace(face) {
  allFaces.forEach((face) => (face.enabled = false));
  face.enabled = true;
}
async function pulse(duration) {
  enableFace(pulserFace);
  await pulserFace.display(duration);
}
async function colors(duration) {
  enableFace(colorFace);
  await colorFace.display();
}
// ============= Start =============
(async () => {
  Matrix_1.matrix.brightness(matrixConfig.brightness);
  await pulse(5000);
  defaultFace();
})();
// ============= API =============
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3005;
app.get("/clock", async (req, res) => {
  const msg = "Clock";
  console.log(msg);
  showClock();
  res.send(msg);
});
app.get("/text/:text", async (req, res) => {
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
app.get("/pulse", async (req, res) => {
  const msg = "Pulse";
  console.log(msg);
  res.send(msg);
  await pulse();
  defaultFace();
});
app.get("/colors", async (req, res) => {
  const msg = "Colors";
  console.log(msg);
  res.send(msg);
  await colors();
});
app.get("/config", async (req, res) => {
  console.log(matrixConfig.config());
  res.send(matrixConfig.config());
});
app.get("/config/brightness/:brightness", async (req, res) => {
  const brightness = req.params.brightness;
  const msg = "Brightness : " + brightness;
  console.log(msg);
  res.send(msg);
  const brightnessNumber = parseInt(brightness, 10);
  matrixConfig.brightness = brightnessNumber;
  Matrix_1.matrix.brightness(brightnessNumber).sync();
});
app.get("/config/primary/:primary", async (req, res) => {
  const primary = req.params.primary;
  const msg = "Primary : " + primary;
  console.log(msg);
  res.send(msg);
  matrixConfig.primaryColor = parseInt(primary);
});
app.get("/config/secondary/:secondary", async (req, res) => {
  const secondary = req.params.secondary;
  const msg = "Secondary : " + secondary;
  console.log(msg);
  res.send(msg);
  matrixConfig.secondaryColor = parseInt(secondary);
});
app.get("/config/alternate/:alternate", async (req, res) => {
  const alternate = req.params.alternate;
  const msg = "Alternate : " + alternate;
  console.log(msg);
  res.send(msg);
  matrixConfig.alternateColor = parseInt(alternate);
});
app.get("/stop", async (req, res) => {
  const msg = "Stop";
  console.log(msg);
  res.send(msg);
  stop();
});
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
