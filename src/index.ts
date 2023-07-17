require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l')
const listEndpoints = require('express-list-endpoints')

import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import { PulserFace } from './PulserFace'
import { ClockFace, ClockStyleEnum } from './ClockFace'
import { TextFace } from './TextFace'

import { matrix } from './Matrix'
import { MatrixConfig } from './MatrixConfig'
import { ColorFace } from './ColorFace'
import { CircleFace } from './CircleFace'
import { PictureFace } from './PictureFace'
import { RandomFace } from './RandomFace'
import { VolumeBarsFace } from './VolumeBarsFace'
import { ArrowFace } from './ArrowFace'
import { LifeGameFace } from './LifeGameFace'

const matrixConfig = new MatrixConfig()
const pulserFace = new PulserFace(matrix)
const clockFace = new ClockFace(matrix, matrixConfig)
const textFace = new TextFace(matrix, matrixConfig)
const colorFace = new ColorFace(matrix, matrixConfig)
const circleFace = new CircleFace(matrix, matrixConfig)
const pictureFace = new PictureFace(matrix, matrixConfig)
const randomFace = new RandomFace(matrix, matrixConfig)
const volumeBarsFace = new VolumeBarsFace(matrix, matrixConfig)
const arrowFace = new ArrowFace(matrix, matrixConfig)
const lifeGameFace = new LifeGameFace(matrix, matrixConfig)

const allFaces: Face[] = [
  pulserFace,
  clockFace,
  textFace,
  circleFace,
  colorFace,
  randomFace,
  volumeBarsFace,
  pictureFace,
  arrowFace,
  lifeGameFace,
]

// ============= Features =============

function stop() {
  allFaces.forEach(face => (face.enabled = false))

  matrix
    .clear()
    .afterSync(() => undefined)
    .sync()
}

function switchTheme(theme: string) {
  if (theme == 'default') {
    matrixConfig.primaryColor = 0xffffff
    matrixConfig.secondaryColor = 0x92a8d1
    matrixConfig.alternateColor = 0x92a8d1
  } else if (theme == 'orange') {
    matrixConfig.primaryColor = 0xffffff
    matrixConfig.secondaryColor = 0xffa500
    matrixConfig.alternateColor = 0xffa500
  } else if (theme == 'purple') {
    matrixConfig.primaryColor = 0xffffff
    matrixConfig.secondaryColor = 0x6b5b95
    matrixConfig.alternateColor = 0x6b5b95
  } else if (theme == 'green') {
    matrixConfig.primaryColor = 0xffffff
    matrixConfig.secondaryColor = 0x88b04b
    matrixConfig.alternateColor = 0x88b04b
  } else if (theme == 'pink') {
    matrixConfig.primaryColor = 0xffffff
    matrixConfig.secondaryColor = 0xbc243c
    matrixConfig.alternateColor = 0xbc243c
  } else {
    console.warn(`theme ${theme} not found`)
  }
}

function showClock(style?: ClockStyleEnum) {
  if (style) {
    clockFace.style = style
  }

  if (!clockFace.enabled) {
    enableFace(clockFace)
    clockFace.display()
  }
}

const defaultFace = showClock

function enableFace(face: Face) {
  console.log(`Enable face ${face.name}`)
  allFaces.forEach(face => (face.enabled = false))
  face.enabled = true
}

async function runFace(face: Face, fn: (...args: any[]) => Promise<any>) {
  if (!allFaces.includes(face)) {
    console.warn(`All faces array does not include ${face.name} !`)
    return
  }

  if (face.enabled) {
    console.log(`Face ${face.name} already enabled`)
    return
  }

  matrix.afterSync(() => undefined)
  enableFace(face)
  await fn()

  defaultFace()
}

const runFaceDefaultWithDuration = async (
  face: SimpleDisplayWithDuration,
  duration?: number,
) => {
  runFace(face, () => face.display(duration))
}

const showPicture = (picture: string, type?: 'png' | 'gif') =>
  runFace(pictureFace, () => pictureFace.display(picture, type))

const text = (txt: string, duration?: number) =>
  runFace(textFace, () => textFace.display(txt, duration))

// ============= Start =============

;(async () => {
  matrix.brightness(matrixConfig.brightness)
  switchTheme('blue')
  runFaceDefaultWithDuration(pulserFace, 5000)
})()

// ============= API =============

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3005

app.get('/clock/:style?', async (req: Request, res: Response) => {
  const param: string = req.params.style
  const style = (param as ClockStyleEnum) || ClockStyleEnum.CLASSIC
  const msg = 'Clock with style ' + style
  console.log(msg)

  showClock(style)
  res.send(msg)
})

app.get('/text/:text/:duration?', async (req: Request, res: Response) => {
  const txt = req.params.text
  var msg = '> Text received : ' + txt
  const duration = parseInt(req.params.duration) || undefined

  if (duration) {
    msg += ' with duration ' + duration
  }

  if (!textFace.animationIsOver) {
    msg += ', skipped'
    console.log(msg)
    res.send(msg)
    return
  }

  console.log(msg)
  res.send(msg)

  await text(txt, duration)
  defaultFace()
})

app.get(
  '/animation/:animation/:duration?',
  async (req: Request, res: Response) => {
    const param: string = req.params.duration
    const animation: string = req.params.animation
    const duration = parseInt(param) || undefined

    var msg = '> ' + animation
    if (duration) {
      msg += ' with duration ' + duration
    }

    console.log(msg)
    res.send(msg)

    if (animation == 'random') {
      await runFaceDefaultWithDuration(randomFace, duration)
    } else if (animation == 'circle') {
      await runFaceDefaultWithDuration(circleFace, duration)
    } else if (animation == 'arrow') {
      await runFaceDefaultWithDuration(arrowFace, duration)
    } else if (animation == 'pulse') {
      await runFaceDefaultWithDuration(pulserFace, duration)
    } else if (animation == 'volumeBars') {
      await runFaceDefaultWithDuration(volumeBarsFace, duration)
    } else if (animation == 'colors') {
      await runFaceDefaultWithDuration(colorFace, duration)
    } else if (animation == 'lifeGame') {
      await runFaceDefaultWithDuration(lifeGameFace, duration)
    }
  },
)

app.get('/picture/:picture/:type?', async (req: Request, res: Response) => {
  const picture = req.params.picture
  const type = req.params.type as 'png' | 'gif' | undefined
  const msg = '> Picture ' + picture
  console.log(msg)
  res.send(msg)

  await showPicture(picture, type)
})

app.get('/config', async (req: Request, res: Response) => {
  console.log(matrixConfig.config())
  res.send(matrixConfig.config())
})

app.get(
  '/config/brightness/:brightness',
  async (req: Request, res: Response) => {
    const brightness = req.params.brightness
    const msg = '> Brightness : ' + brightness
    console.log(msg)
    res.send(msg)

    const brightnessNumber = parseInt(brightness, 10)
    matrixConfig.brightness = brightnessNumber
    matrix.brightness(brightnessNumber)
  },
)

app.get('/config/primary/:primary', async (req: Request, res: Response) => {
  const primary = req.params.primary
  const msg = '> Primary : ' + primary
  console.log(msg)
  res.send(msg)

  matrixConfig.primaryColor = parseInt(primary)
})

app.get('/config/secondary/:secondary', async (req: Request, res: Response) => {
  const secondary = req.params.secondary
  const msg = '> Secondary : ' + secondary
  console.log(msg)
  res.send(msg)

  matrixConfig.secondaryColor = parseInt(secondary)
})

app.get('/config/alternate/:alternate', async (req: Request, res: Response) => {
  const alternate = req.params.alternate
  const msg = '> Alternate : ' + alternate
  console.log(msg)
  res.send(msg)

  matrixConfig.alternateColor = parseInt(alternate)
})

app.get('/config/theme/:theme', async (req: Request, res: Response) => {
  const theme = req.params.theme
  const msg = '> Theme : ' + theme
  console.log(msg)
  res.send(msg)

  switchTheme(theme)
})

app.get('/stop', async (req: Request, res: Response) => {
  const msg = '> Stop'
  console.log(msg)
  res.send(msg)

  stop()
})

app.get('/endpoints', async (req: Request, res: Response) => {
  res.send(listEndpoints(app))
})

app.listen(port, () => {
  console.log(`[server]: Clock server is running at http://localhost:${port}`)
})
