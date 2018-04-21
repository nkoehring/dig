import SeedRng from 'seedrandom'
import FastSimplexNoise from 'fast-simplex-noise'
import * as T from './block-types'
import * as P from './block-probabilities'
import * as L from './block-levels'

export default class BlockGen {
  constructor (seed = 'so freakin random') {
    const simplex = new FastSimplexNoise({ random: SeedRng(seed) })
    this.rand = (x, y) => 0.5 + 0.5 * simplex.raw2D(x, y)
  }

  block (level, column, above, before) {
    if (level < L.PEAK) return this.air()

    const r = Math.abs(this.rand(level, column))
    if (level < L.GROUND) return this.tree(r, above)
    if (level < L.ROCK) return this.ground(r, above)
    if (level < L.UNDERGROUND) return this.rock(r)
    return this.underground(r, above, before, level - L.UNDERGROUND)
  }

  // always returns air
  air () {
    return T.AIR
  }

  // returns mostly air, but sometimes starts a tree
  tree (r, above) {
    const peak = above === T.AIR && r < P.TREE
    if (peak || above === T.WOOD) return T.WOOD
    return T.AIR
  }

  // returns mostly soil and grass, sometimes gravel and sometimes air
  ground (r, above) {
    if (above === T.AIR && r < P.SOIL_HOLE) return T.AIR
    if (above === T.AIR) return T.GRASS
    if (above === T.WOOD) return T.SOIL
    return r < P.SOIL_GRAVEL ? T.GRAVEL : T.SOIL
  }

  // returns mostly stones, sometimes gravel
  rock (r) {
    return r < P.ROCK_GRAVEL ? T.GRAVEL : T.STONE
  }

  // return mostly bedrock, sometimes caves, depending on the level
  underground (r, above, before, level) {
    if (above === T.STONE || above === T.GRAVEL) return T.BEDROCK
    const a = P.CAVE / P.CAVE_MAX**2
    const p = Math.min(P.CAVE, a * level**2)

    if (r < p) return T.CAVE
    return T.BEDROCK
  }
}
