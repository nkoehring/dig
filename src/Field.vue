<template>
  <div id="field">
    <input v-keep-focussed type="text"
      @keydown.up="player_push_y = -8"
      @keydown.down="player_push_y = 8"
      @keydown.right="player_push_x = 8"
      @keydown.left="player_push_x = -8"
      @keyup.up="player_push_y = 0"
      @keyup.down="player_push_y = 0"
      @keyup.right="player_push_x = 0"
      @keyup.left="player_push_x = 0"
    />
    <mountain-background :x="128 + x / 8" />
    <div id="wrap" :style="{transform: `translate(${tx}px, ${ty}px)`}">
      <template v-for="row in rows">
        <div v-for="block in row" class="block" :class="[block.type]" />
      </template>
    </div>
    <div id="player" :class="[player_direction]" :data-x="player_x" :data-y="player_y" />
    <div id="level-indicator">x:{{ floorX }}, y:{{ floorY }}</div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
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
      player_x: PLAYER_X,
      player_y: PLAYER_Y,
      player_direction: 'left',
      player_push_x: 0,
      player_push_y: 0,
      player_velocity_x: 0,
      player_velocity_y: 0,
      moving: false
    }
  },
  mounted () {
    this.player_velocity_y = 8
    this.move()
  },
  watch: {
    player_push_x (px) {
      if (px === 0) this.player_velocity_x = 0
      else this.player_velocity_x = px
    },
    player_push_y (py) {
      if (py === 0) this.player_velocity_y = 8
      else this.player_velocity_y = py
    }
  },
  computed: {
    blockAtPlayer () { return this.rows[PLAYER_Y][PLAYER_X] },
    blockLeftOfPlayer () { return this.rows[PLAYER_Y][PLAYER_X - 1] },
    blockRightOfPlayer () { return this.rows[PLAYER_Y][PLAYER_X + 1] },
    blockAbovePlayer () { return this.rows[PLAYER_Y - 1][PLAYER_X] },
    blockBelowPlayer () { return this.rows[PLAYER_Y + 1][PLAYER_X] },
    blockedUp () { return this.cornerY && !this.blockAbovePlayer.walkable },
    blockedDown () { return this.cornerY && !this.blockBelowPlayer.walkable },
    blockedLeft () { return this.cornerX && !this.blockLeftOfPlayer.walkable },
    blockedRight () { return this.cornerX && !this.blockRightOfPlayer.walkable },
    cornerX () { return this.x === ~~this.x }, // cornering a block
    cornerY () { return this.y === ~~this.y },
    floorX () { return Math.floor(this.x) },
    floorY () { return Math.floor(this.y) },
    tx () { return (this.x - this.floorX) * -BLOCK_SIZE },
    ty () { return (this.y - this.floorY) * -BLOCK_SIZE },
    rows () { return level.grid(this.floorX, this.floorY) }
  },
  methods: {
    move () {
      const x = this.x
      const y = this.y
      let vx = this.player_velocity_x * RECIPROCAL
      let vy = this.player_velocity_y * RECIPROCAL

      if (vx < 0) this.player_direction = 'left'
      if (vx > 0) this.player_direction = 'right'

      if (vx > 0 && this.blockedRight) vx = 0
      if (vx < 0 && this.blockedLeft) vx = 0
      if (vy > 0 && this.blockedDown) vy = 0
      if (vy < 0 && this.blockedUp) vy = 0

      this.x += vx
      this.y += vy
      this.moving = setTimeout(() => this.move(), 50)
    },
  }
}
</script>

<style>
#field {
  position: relative;
  width: 1024px;
  height: 1024px;
  margin: auto;
  overflow: hidden;
  background-color: #56F;
}
#field > input {
  position: absolute;
  opacity: 0;
  display: block;
  width: 1px;
  height: 1px;
}
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
.block.grass   { background-image: url(./assets/grass01.png); }

.block.tree_top_left     { background-image: url(./assets/tree_top_left.png); }
.block.tree_top_middle   { background-image: url(./assets/tree_top_middle.png); }
.block.tree_top_right    { background-image: url(./assets/tree_top_right.png); }

.block.tree_crown_left   { background-image: url(./assets/tree_crown_left.png); }
.block.tree_crown_middle { background-image: url(./assets/tree_crown_middle.png); }
.block.tree_crown_right  { background-image: url(./assets/tree_crown_right.png); }

.block.tree_trunk_left   { background-image: url(./assets/tree_trunk_left.png); }
.block.tree_trunk_middle { background-image: url(./assets/tree_trunk_middle.png); }
.block.tree_trunk_right  { background-image: url(./assets/tree_trunk_right.png); }

.block.tree_root_left    { background-image: url(./assets/tree_root_left.png); }
.block.tree_root_middle  { background-image: url(./assets/tree_root_middle.png); }
.block.tree_root_right   { background-image: url(./assets/tree_root_right.png); }

.block.tree_top_left_mixed     { background-image: url(./assets/tree_top_left_mixed.png); }
.block.tree_crown_left_mixed   { background-image: url(./assets/tree_crown_left_mixed.png); }
.block.tree_trunk_left_mixed   { background-image: url(./assets/tree_trunk_left_mixed.png); }
.block.tree_root_left_mixed    { background-image: url(./assets/tree_root_left_mixed.png); }

.block.tree_top_right_mixed    { background-image: url(./assets/tree_top_right_mixed.png); }
.block.tree_crown_right_mixed  { background-image: url(./assets/tree_crown_right_mixed.png); }
.block.tree_trunk_right_mixed  { background-image: url(./assets/tree_trunk_right_mixed.png); }
.block.tree_root_right_mixed   { background-image: url(./assets/tree_root_right_mixed.png); }

.block.soil    { background-image: url(./assets/soil.png); }
.block.soil_gravel { background-image: url(./assets/soil_gravel.png); }
.block.stone_gravel { background-image: url(./assets/rock_gravel.png); }
.block.stone   { background-image: url(./assets/rock.png); }
.block.bedrock { background-image: url(./assets/bedrock.png); }
.block.cave    { background-color: #000; }
.block:hover, .block.highlight { filter: brightness(1.4); }
</style>
