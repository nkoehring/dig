import * as T from './block-types'
import * as L from './block-levels'
import BlockGen from './block-generator'

export default class Level {
  constructor (width, height) {
    this._x = 0
    this._y = 0
    this._w = width
    this._h = height
    this._grid = new Array(height)
    this.blockGen = new BlockGen('super random seed')
  }

  grid (x, y) {
    this._x = x
    this._y = y
    this.generate()
    return this._grid
  }

  generate () {
    // TODO: caching
    for (let i = 0; i < this._h; i++) {
      this._grid[i] = this._row(i + this._y)
    }
  }

  _row (level = 0) {
    const row = Array(this._w)
    const previousRow = this._grid[level - 1] || Array()

    // first step: generate a row for the given level
    for (let i = 0; i < row.length; i++) {
      const above = previousRow[i]
      row[i] = this.blockGen.block(level, i, above, row[i - 1])
    }

    // second step: add extras like tree leaves
    if (level < L.GROUND && level > L.PEAK) {
      for (let i = 0; i < row.length; i++) {
        const above = previousRow[i]
        const block = row[i]

        if (block === T.WOOD && above === T.AIR) {
          if (row[i - 1] === T.AIR) row[i - 1] = T.LEAVES
          if (row[i + 1] === T.AIR) row[i + 1] = T.LEAVES
          previousRow[i] = T.LEAVES
        }
      }
    }

    return row
  }
}
