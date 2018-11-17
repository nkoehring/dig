<template>
  <div id="field" :class="daytimeClass">
    <input v-keep-focussed type="text"
      @keydown.up="jump = jump || !blocked.below ? jump : 20"
      @keydown.right="player_velocity_x = 8"
      @keydown.left="player_velocity_x = -8"
      @keyup.right="player_velocity_x = 0"
      @keyup.left="player_velocity_x = 0"
      @keypress.p="togglePause"
    />
    <mountain-background :x="128 + x / 8" :time="time" />
    <div id="wrap" :style="{transform: `translate(${tx}px, ${ty}px)`}">
      <template v-for="(row, y) in rows">
        <div v-for="(block, x) in row" class="block" :class="[block.type]" />
      </template>
    </div>
    <div id="player" :class="[player_direction]" />
    <div id="level-indicator">
      x:{{ floorX }}, y:{{ floorY }}
      <template v-if="moving !== false">({{clock}})</template>
      <template v-else>(PAUSED)</template>
    </div>
  </div>
</template>

<script>
// import throttle from 'lodash/throttle'
import Level from './level'
import Player from './player'
import MountainBackground from './Background'

const BLOCK_SIZE = 32
const RECIPROCAL = 1 / BLOCK_SIZE
const PLAYER_X = ~~(BLOCK_SIZE / 2) + 1
const PLAYER_Y = BLOCK_SIZE - 15
const PLAYER_MAX_VELOCITY = 32
const level = new Level(BLOCK_SIZE + 2, BLOCK_SIZE + 2)

export default {
  name: 'field',
  components: { MountainBackground },
  data () {
    return {
      x: 0,
      y: 0,
      player_direction: 'left',
      player_velocity_x: 0,
      player_velocity_y: 8,
      jump: 0,
      gravity: 8.0 / 20,
      moving: false,
      time: 250
    }
  },
  mounted () {
    this.move()
  },
  computed: {
    rows () { return level.grid(this.floorX, this.floorY) },
    surroundings () {
      const px = PLAYER_X
      const py = PLAYER_Y
      const at = this.rows[py][px]
      const left = this.rows[py][px]
      const right = this.rows[py][px + 1]
      const above = this.rows[py - 1][px] || at
      const below = this.rows[py + 1][px]

      return { at, left, right, above, below }
    },
    blocked () {
      const { at, left, right, above, below } = this.surroundings

      return {
        at: !at.walkable,
        left: !left.walkable,
        right: !right.walkable,
        above: !above.walkable,
        below: !below.walkable
      }
    },
    floorX () { return Math.floor(this.x) },
    floorY () { return Math.floor(this.y) },
    tx () { return (this.x - this.floorX) * -BLOCK_SIZE },
    ty () { return (this.y - this.floorY) * -BLOCK_SIZE },
    daytimeClass () {
      const t = this.time
      if (t >= 900 || t < 80) return "night"

      if (t >= 80 && t < 120) return "morning0"
      if (t >= 120 && t < 150) return "morning1"
      if (t >= 150 && t < 240) return "morning2"

      if (t >= 700 && t < 800) return "evening0"
      if (t >= 800 && t < 850) return "evening1"
      if (t >= 850 && t < 900) return "evening2"

      return "day"
    },
    clock () {
      const t = this.time * 86.4 // 1000 ticks to 86400 seconds (per day)
      const h = ~~(t / 3600.0)
      const m = ~~((t / 3600.0 - h) * 60.0)
      return `${(h + 2) % 24}:${m < 10 ? '0' : ''}${m}`
    }
  },
  methods: {
    move () {
      // set time of day in ticks
      this.time = (this.time + 0.1) % 1000

      const x = this.x
      const y = this.y

      // this.player_velocity_y += this.gravity
      let vx = this.player_velocity_x * RECIPROCAL
      let vy = (this.player_velocity_y - this.jump) * RECIPROCAL

      if (this.jump > 0) this.jump -= 2

      // change player graphic according to direction
      if (vx < 0) this.player_direction = 'left'
      if (vx > 0) this.player_direction = 'right'

      // don't walk / fall into blocks
      if (vx > 0 && this.blocked.right) vx = 0
      if (vx < 0 && this.blocked.left) vx = 0
      if (vy > 0 && this.blocked.below) vy = 0
      if (vy < 0 && this.blocked.above) vy = 0

      this.x += vx
      this.y += vy
      this.moving = setTimeout(() => this.move(), 64) // roughly every 4 frames
    },
    togglePause () {
      if (this.moving === false) { // is paused
        this.moving = true // avoid (unlikely) race condition
        this.move()
      } else {
        clearTimeout(this.moving)
        this.moving = false
      }
    }
  }
}
</script>

<style src="./assets/field.css" />
<style>
#level-indicator {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
}
#player  {
  position: absolute;
  left: calc(32px * 16);
  top: calc(32px * 16);
  background-image: url(./assets/dwarf_right.png);
}
#player.right { background-image: url(./assets/dwarf_right.png); }
#player.left  { background-image: url(./assets/dwarf_left.png); }
#player.up  { background-image: url(./assets/dwarf_back.png); }
#player.down  { background-image: url(./assets/dwarf_back.png); }
#player, .block {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  background-color: transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
#wrap {
  position: absolute;
  top: -32px;
  left: -32px;
  width: 1088px;
  height: 1088px;
  display: flex;
  flex-flow: row wrap;
}
.left-of-player, .right-of-player, .below-player { outline: 2px solid #FFF5; }
</style>
