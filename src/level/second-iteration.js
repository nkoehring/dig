import {type as T, level as L, probability as P} from './def'

export default class BlockExt {
  constructor (noiseGen) {
    this.rand = (x, y) => 0.5 + 0.5 * noiseGen.noise2D(x, y)
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
    const max = row.length - 1

    if (row[i] === T.tree_top_middle) {
      if (i) {
        if (row[i - 1] === T.tree_top_right) row[i - 1] = T.tree_top_left_mixed
        else row[i - 1] = T.tree_top_left
      }
      if (i < max) row[i + 1] = T.tree_top_right

    } else if (previousRow[i] === T.tree_top_middle) {
      row[i] = T.tree_crown_middle
      if (i) {
        if (row[i - 1] === T.tree_crown_right) row[i - 1] = T.tree_crown_left_mixed
        else row[i - 1] = T.tree_crown_left
      }
      if (i < max) row[i + 1] = T.tree_crown_right
    } else if (previousRow[i] === T.tree_crown_middle) {
      row[i] = T.tree_trunk_middle
      if (i) {
        if (row[i - 1] === T.tree_trunk_right) row[i - 1] = T.tree_trunk_left_mixed
        else row[i - 1] = T.tree_trunk_left
      }
      if (i < max) row[i + 1] = T.tree_trunk_right
    } else if (previousRow[i] === T.tree_trunk_middle) {
      row[i] = T.tree_root_middle
      if (i) {
        if (row[i - 1] === T.tree_root_right) row[i - 1] = T.tree_root_left_mixed
        else row[i - 1] = T.tree_root_left
      }
      if (i < max) row[i + 1] = T.tree_root_right
    }
  }

  ground (r, i, row, previousRow) {
    const tree_parts = [T.tree_root_left, T.tree_root_middle, T.tree_root_right]
    if (previousRow[i] === T.air) {
      if (r < P.soil_hole) row[i] = T.air
      if (row[i] === T.soil) row[i] = T.grass
    } else if (tree_parts.indexOf(previousRow[i]) >= 0) {
      if (row[i] === T.soil) row[i] = T.grass
    }
  }

  rock (r, i, row, previousRow) {
    if (previousRow[i] === T.soil && r < P.fray) row[i] = T.soil
  }

  underground (r, i, row, previousRow) {
    if (previousRow[i] === T.stone && r < P.fray) row[i] = T.stone
  }
}
