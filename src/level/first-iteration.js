import {type as T, level as L, probability as P} from './def'

export default class BlockGen {
  constructor (noiseGen) {
    this.rand = (x, y) => 0.5 + 0.5 * noiseGen.noise2D(x, y)
  }

  level (level, column, row, previousRow) {
    for (let i = 0; i < row.length; i++) {
      row[i] = this.block(level, column + i, row[i], row[i - 1], previousRow[i])
    }
  }

  block (level, column, current, before, above) {
    if (level < L.peak) return this.air()

    const r = this.rand(level, column)
    if (level < L.ground) {
      if (level === L.treeTop) return this.treeTop(r)
      return this.air()
    }
    if (level < L.rock) return this.ground(r)
    if (level < L.underground) return this.rock(r)
    return this.underground(r, above, before, level - L.underground)
  }

  // always returns air
  air () {
    return T.air
  }

  // returns mostly air, but sometimes starts a tree
  treeTop (r) {
    if (r < P.tree) return T.tree_top_middle
    return T.air
  }

  // returns mostly soil and grass, sometimes gravel and sometimes air
  ground (r) {
    if (r < P.soil_gravel) return T.soil_gravel
    return T.soil
  }

  // returns mostly stones, sometimes gravel
  rock (r) {
    return r < P.stone_gravel ? T.stone_gravel : T.stone
  }

  // return mostly bedrock, sometimes caves, depending on the level
  underground (r, above, before, level) {
    // the probability for a cave rises with the level
    const a = P.cave / L.cave_max**2
    const p = Math.min(P.cave, a * level**2)

    if (r < p) return T.cave
    return T.bedrock
  }
}
