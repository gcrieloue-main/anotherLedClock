export interface Picture {
  pixels: Pixel[]
  width: number
  height: number
}

export interface Pixel {
  x: number
  y: number
  color: number
}
