<template>
  <div id="field" :class="daytimeClass">
    <input v-keep-focussed type="text"
      @keydown.up="inputY = -1"
      @keydown.down="inputY = 1"
      @keydown.right="inputX = -1"
      @keydown.left="inputX = 1"
      @keyup.up="inputY = inputY === -1 ? 0 : 1"
      @keyup.down="inputY = inputY === 1 ? 0 : 1"
      @keyup.right="inputX = inputX === -1 ? 0 : 1"
      @keyup.left="inputX = inputX === 1 ? 0: -1"
      @keypress.p="togglePause"
      @keydown.space="digging = true"
      @keyup.space="digging = false"
    />
    <mountain-background :x="128 + x / 8" :time="time" />
    <div id="wrap" :style="{transform: `translate(${tx}px, ${ty}px)`}">
      <template v-for="(row, y) in rows">
        <div v-for="(block, x) in row" class="block" :class="[block.type]" />
      </template>
    </div>
    <div id="player" :class="[player.direction]" />
    <div id="level-indicator">
      x:{{ floorX }}, y:{{ floorY }}
      <template v-if="moving !== false">({{clock}})</template>
      <template v-else>(PAUSED)</template>
    </div>
  </div>
</template>

<script>
// import throttle from 'lodash/throttle'
import MountainBackground from './Background'
import Level from './level'
import { Moveable } from './physics'
import {
  BLOCK_SIZE,
  RECIPROCAL,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  PLAYER_X,
  PLAYER_Y
} from './level/def'

const level = new Level(STAGE_WIDTH + 2, STAGE_HEIGHT + 2)
const player = new Moveable(PLAYER_X, PLAYER_Y)

export default {
  name: 'field',
  components: { MountainBackground },
  data () {
    return {
      player,
      x: 0,
      y: 12,
      inputX: 0,
      inputY: 0,
      time: 250,
      moving: false,
      lastTick: 0
    }
  },
  mounted () {
    this.lastTick = performance.now()
    this.move(this.lastTick)
  },
  computed: {
    rows () { return level.grid(this.floorX, this.floorY) },
    surroundings () {
      const px = PLAYER_X
      const py = PLAYER_Y
      const at = this.rows[py][px]
      const left = this.rows[py][px]
      const right = this.rows[py][px + 1]
      const up = this.rows[py - 1][px] || at
      const down = this.rows[py + 1][px]

      return { at, left, right, up, down }
    },
    blocked () {
      const { at, left, right, up, down } = this.surroundings

      return {
        at: !at.walkable,
        left: !left.walkable,
        right: !right.walkable,
        up: !up.walkable,
        down: !down.walkable
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
    move (thisTick) {
      this.moving = requestAnimationFrame(this.move)

      // keep roughly 20 fps
      if (thisTick - this.lastTick < 50) return

      // set time of day in ticks
      this.time = (this.time + 0.1) % 1000

      const player = this.player
      const x = player.x
      const y = player.y

      let dx = player.vx * player.dir * RECIPROCAL
      let dy = player.vy * RECIPROCAL

      // don't walk / fall into blocks
      if (dx > 0 && this.blocked.right) dx = 0
      if (dx < 0 && this.blocked.left) dx = 0
      if (dy > 0 && this.blocked.down) dy = 0
      if (dy < 0 && this.blocked.up) dy = 0

      // don't walk, work!
      if (!this.inputY && this.digging) {
        dx = 0
        this.dig()
      }

      this.x += dx
      this.y += dy
      this.lastTick = thisTick
    },
    dig () {
      console.log('dig', this.playerDirection, this.surroundings[this.playerDirection])
      // lets not bother with invincible blocks (like air or cave)
      if (this.surroundings[this.playerDirection].hp >= Infinity) return

      const px = this.floorX + PLAYER_X
      const py = this.floorY + PLAYER_Y
      const block = {...this.surroundings[this.playerDirection]}

      block.hp--
      level.change(py, px, block)
    },
    togglePause () {
      if (this.moving === false) { // is paused
        this.move()
      } else {
        cancelAnimationFrame(this.moving)
        this.moving = false
      }
    }
  }
}
</script>

<style src="./assets/field.css" />
<style>
:root {
  --block-size: 32px;
  --field-width: 1024px;
  --field-height: 576px;
  --spare-blocks: 2;
}

#level-indicator {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
}
#player  {
  position: absolute;
  left: calc(var(--field-width) / 2);
  top: calc(var(--field-height) / 2);
  background-image: url(./assets/dwarf_right.png);
}
#player.right { background-image: url(./assets/dwarf_right.png); }
#player.left  { background-image: url(./assets/dwarf_left.png); }
#player.up  { background-image: url(./assets/dwarf_back.png); }
#player.down  { background-image: url(./assets/dwarf_back.png); }
#player, .block {
  flex: 0 0 auto;
  width: var(--block-size);
  height: var(--block-size);
  background-color: transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
#wrap {
  position: absolute;
  top: calc(var(--block-size) * (var(--spare-blocks) / -2));
  left: calc(var(--block-size) * (var(--spare-blocks) / -2));
  width: calc(var(--field-width) + var(--spare-blocks) * var(--block-size));
  height: calc(var(--field-height) + var(--spare-blocks) * var(--block-size));
  display: flex;
  flex-flow: row wrap;
}
</style>
