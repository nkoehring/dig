import SeedRng from 'seedrandom'
import FastSimplexNoise from 'fast-simplex-noise'

import {type as T, level as L} from './def'
import BlockGen from './first-iteration'
import BlockExt from './second-iteration'

export default class Level {
  constructor (width, height, seed = 'super random seed') {
    const random = SeedRng(seed)
    const noiseGen = new FastSimplexNoise({ random })
    this._x = 0
    this._y = 0
    this._w = width
    this._h = height
    this._grid = new Array(this._h)
    this.blockGen = new BlockGen(noiseGen)
    this.blockExt = new BlockExt(noiseGen)
  }

  grid (x, y) {
    this._x = x
    this._y = y

    this.generate()
    return this._grid
  }

  generate () {
    for (let i = 0; i < this._h; i++) {
      const level = this._y + i
      const row = Array(this._w)
      const previousRow = this._grid[i - 1] || Array()
      this.blockGen.level(level, row, previousRow)
      this.blockExt.level(level, row, previousRow)
      this._grid[i] = row
    }
  }
}
