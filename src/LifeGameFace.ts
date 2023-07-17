import { LedMatrixInstance } from 'rpi-led-matrix'
import { MatrixConfig } from './MatrixConfig'
import { wait } from './Utils'

export class LifeGameFace implements Face {
  public name = 'LifeGame'
  public enabled = false
  matrix: LedMatrixInstance
  offset: number = 0
  config: MatrixConfig
  rate = 50

  matrixArray: number[][] = []

  constructor(ledMatrix: LedMatrixInstance, config: MatrixConfig) {
    this.matrix = ledMatrix
    this.config = config
  }

  public async display(duration = 10000) {
    const rows = 16
    const cols = 32

    this.matrix.clear()
    this.matrixArray = new Array(rows)
    for (let i = 0; i < rows; i++) {
      this.matrixArray[i] = new Array(cols).fill(0)
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.matrixArray[i][j] = Math.random() > 0.5 ? 1 : 0
      }
    }

    this.matrix.afterSync(() => {
      let newMatrix = new Array(rows)
      for (let i = 0; i < rows; i++) {
        newMatrix[i] = new Array(cols).fill(0)
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const neighbors = this.countNeighbors(i, j)
          if (this.matrixArray[i][j] === 1) {
            // Si une cellule vivante a moins de deux voisins ou plus de trois voisins, elle meurt
            if (neighbors < 2 || neighbors > 3) {
              newMatrix[i][j] = 0
            } else {
              newMatrix[i][j] = 1
            }
          } else {
            // Si une cellule morte a exactement trois voisins, elle devient vivante
            if (neighbors === 3) {
              newMatrix[i][j] = 1
            }
          }
        }
      }

      this.matrixArray = newMatrix

      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 32; j++) {
          this.matrix
            .fgColor(this.matrixArray[i][j] === 1 ? 0xffffff : 0)
            .setPixel(i, j)
        }
      }

      setTimeout(() => {
        if (this.enabled) {
          this.matrix.sync()
        }
      }, this.rate)
    })

    this.matrix.sync()
    await wait(duration)
  }

  // Fonction pour compter le nombre de voisins d'une cellule donnée
  countNeighbors(row: number, col: number) {
    const rows = 16
    const cols = 32

    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighborRow = row + i
        const neighborCol = col + j
        if (
          neighborRow >= 0 &&
          neighborRow < rows &&
          neighborCol >= 0 &&
          neighborCol < cols &&
          !(i === 0 && j === 0)
        ) {
          count += this.matrixArray[neighborRow][neighborCol]
        }
      }
    }
    return count
  }
}
