import {type as T} from './def'

export default class Player {
  constructor (grid) {
    this._player_changes = []
    this._grid = grid
  }

  setPosition (px, py) {
    const block = this._grid[py][px]

    if (block.walkable) {
      T.player.background = block.type
      this._grid[py][px] = T.player
    }
  }
}
