import {type as T, level as L, probability as P} from './def'

export default class BlockExt {
  constructor (noiseGen) {
    this.rand = (x, y) => 0.5 + 0.5 * noiseGen.raw2D(x, y)
  }

  level (level, column, row, previousRow) {
    for (let i = 0; i < row.length; i++) {
      const r = Math.abs(this.rand(level, column + i))

      if (level < L.ground) this.trees(r, i, row, previousRow, level)
      else if (level < L.rock) this.ground(r, i, row, previousRow)
      else if (level < L.underground) this.rock(r, i, row, previousRow)
      else this.underground(r, i, row, previousRow)
    }
  }

  trees (r, i, row, previousRow, level) {
    if (row[i] === T.wood && previousRow[i] === T.air) {
      if (row[i - 1] === T.air) row[i - 1] = T.leaves
      if (row[i + 1] === T.air) row[i + 1] = T.leaves
      previousRow[i] = T.leaves
    } else if (previousRow[i] === T.wood) {
      row[i] = T.wood
      if (row[i - 1] === T.wood) row[i - 1] = T.air
    }
  }

  ground (r, i, row, previousRow) {
    if (previousRow[i] === T.air) {
      if (r < P.soil_hole) row[i] = T.air
      if (row[i] === T.soil) row[i] = T.grass
    } else if (previousRow[i] === T.wood && row[i - 1] === T.grass) {
      row[i] = T.wood
    }
  }

  rock (r, i, row, previousRow) {
    if (previousRow[i] === T.soil && r < P.fray) row[i] = T.soil
  }

  underground (r, i, row, previousRow) {
    if (previousRow[i] === T.stone && r < P.fray) row[i] = T.stone
  }
}
