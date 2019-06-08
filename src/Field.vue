<template>
  <div id="field" :class="daytimeClass">
    <input v-keep-focussed type="text"
      @keydown.up="jump = jump || !blocked.down ? jump : 20"
      @keydown.down="moveTo = 'down'"
      @keydown.right="moveTo = 'right'"
      @keydown.left="moveTo = 'left'"
      @keyup.down="moveTo = null"
      @keyup.right="moveTo = null"
      @keyup.left="moveTo = null"
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
    <div id="player" :class="[playerDirection]" />
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
      playerDirection: 'left',
      playerVelocityX: 0,
      playerVelocityY: 8,
      moveTo: null,
      jump: 0,
      digging: false,
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
    move () {
      // set time of day in ticks
      this.time = (this.time + 0.1) % 1000

      const x = this.x
      const y = this.y

      if (this.moveTo !== null) this.playerDirection = this.moveTo

      if (this.moveTo === 'right') {
        this.playerVelocityX = 8
      } else if (this.moveTo === 'left') {
        this.playerVelocityX = -8
      } else {
        this.playerVelocityX = 0
      }

      // this.player_velocity_y += this.gravity
      let dx = this.playerVelocityX * RECIPROCAL
      let dy = (this.playerVelocityY - this.jump) * RECIPROCAL

      if (this.jump > 0) this.jump -= 2

      // don't walk / fall into blocks
      if (dx > 0 && this.blocked.right) dx = 0
      if (dx < 0 && this.blocked.left) dx = 0
      if (dy > 0 && this.blocked.down) dy = 0
      if (dy < 0 && this.blocked.up) dy = 0

      // don't walk, work!
      if (!this.jump && this.digging) {
        dx = 0
        this.dig()
      }

      this.x += dx
      this.y += dy
      this.moving = setTimeout(() => this.move(), 64) // roughly every 4 frames
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
:root {
  --block-size: 32px;
  --field-width: 1024px;
  --field-height: 1024px;
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
