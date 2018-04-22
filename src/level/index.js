import SeedRng from 'seedrandom'
import FastSimplexNoise from 'fast-simplex-noise'

import {type as T, level as L} from './def'
import BlockGen from './first-iteration'
import BlockExt from './second-iteration'
import Player from './third-iteration'

export default class Level {
  constructor (width, height, seed = 'super random seed') {
    const random = SeedRng(seed)
    const noiseGen = new FastSimplexNoise({ random })
    this._w = width
    this._h = height
    this._grid = new Array(this._h)
    this.blockGen = new BlockGen(noiseGen)
    this.blockExt = new BlockExt(noiseGen)
    this.player = new Player(this._grid)
  }

  grid (x, y, px, py) {
    this.generate(x, y, this._w, this._h, px, py)
    return this._grid
  }

  generate (x, y, w, h, px, py) {
    for (let i = 0; i < h; i++) {
      const level = y + i
      const column = x
      const row = Array(w)
      const previousRow = this._grid[i - 1] || Array()
      this.blockGen.level(level, column, row, previousRow)
      this.blockExt.level(level, column, row, previousRow)
      this._grid[i] = row
    }
    this.player.setPosition(px, py)
  }
}
