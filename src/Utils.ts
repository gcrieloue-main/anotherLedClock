import { Picture, Pixel } from './Types'
var getPixels = require('get-pixels')

export const wait = (t: number) => new Promise(ok => setTimeout(ok, t))

export const randomBoolean = () => Math.random() < 0.5

export const randomElement = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)]

export const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const paddingWithZero = (s: string) => ('00' + s).slice(-2)

export const loadPic = async (
  icon: string,
  type: 'png' | 'gif' = 'png',
): Promise<Picture[]> => {
  return new Promise((resolve, reject) => {
    getPixels('./src/icons/' + icon + '.' + type, (err: any, image: any) => {
      let pixels: any

      if (err) {
        const reason = 'Bad image path'
        console.log(reason)
        reject(reason)
      } else {
        if (type === 'gif') {
          const nbFrames = image.shape[0]
          console.log('gif nb frames : ' + nbFrames)
          pixels = image.pick(0)
          const picture = buildPicture(pixels)
          resolve([picture])
        } else {
          pixels = image
          const picture = buildPicture(pixels)
          resolve([picture])
        }
      }
    })
  })
}

const buildPicture = (pixels: any): Picture => {
  const width = pixels.shape[0]
  const height = pixels.shape[1]
  const pxs: Pixel[] = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = pixels.get(x, y, 0)
      const g = pixels.get(x, y, 1)
      const b = pixels.get(x, y, 2)
      const color = parseInt(
        `0x${paddingWithZero(r.toString(16))}${paddingWithZero(
          g.toString(16),
        )}${paddingWithZero(b.toString(16))}`,
      )
      pxs.push({ x, y, color })
    }
  }

  return { width, height, pixels: pxs }
}
