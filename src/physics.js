import { GRAVITY } from './level/def'

/** physics gets input like
      instance of Moveable,
      position: [x, y],
      surroundings: [top, right, bottom, left] where each is a block type
    and updates the Moveable instance values accordingly
*/

export class Moveable {
  constructor (x, y, direction = 1) {
    this.x = x
    this.y = y
    this.dir = direction
    this.vx = 0
    this.vy = 0
  }

  get direction () {
    return this.dir > 0 ? 'left' : 'right'
  }
}
