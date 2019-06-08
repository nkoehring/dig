import SeedRng from 'seedrandom'
import FastSimplexNoise from 'fast-simplex-noise'

import {type as T, level as L} from './def'
import BlockGen from './first-iteration'
import BlockExt from './second-iteration'
import PlayerChanges from './third-iteration'

export default class Level {
  constructor (width, height, seed = 'super random seed') {
    const random = SeedRng(seed)
    const noiseGen = new FastSimplexNoise({ random })
    this._w = width
    this._h = height
    this._grid = new Array(this._h)
    this.blockGen = new BlockGen(noiseGen)
    this.blockExt = new BlockExt(noiseGen)
    this.playerChanges = new PlayerChanges()
  }

  change (level, column, newBlock) {
    if (newBlock.hp <= 0) {
      newBlock = level > L.rock ? { ...T.cave } : { ...T.air }
    }
    this.playerChanges.apply(level, column, newBlock)
  }

  grid (x, y) {
    this.generate(x, y, this._w, this._h)
    return this._grid
  }

  generate (column, y, width, height) {
    for (let i = 0; i < height; i++) {
      const level = y + i
      const row = Array(width)
      const previousRow = this._grid[i - 1] || Array()
      this.blockGen.level(level, column, row, previousRow)
      this.blockExt.level(level, column, row, previousRow)
      this.playerChanges.level(level, column, row)
      this._grid[i] = row
    }
  }
}
