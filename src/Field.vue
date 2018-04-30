<template>
  <div id="field">
    <input v-keep-focussed type="text"
      @keydown.down="goDown($event)"
      @keydown.up="goUp($event)"
      @keydown.right="goRight($event)"
      @keydown.left="goLeft($event)"
      @keydown.space="jump($event)"
    />
    <mountain-background :x="x + 65536" />
    <div id="wrap" :style="{transform: `translate(${translate_x}px, ${translate_y}px)`}">
      <template v-for="(row, y) in rows">
        <div v-for="(block, x) in row" class="block" :class="[block.type]" :data-x="x" :data-y="y" />
      </template>
    </div>
    <div id="player" :class="[player_direction]" :data-x="player_x" :data-y="player_y" />
    <div id="level-indicator">x:{{ x }}, y:{{ y }}</div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import Level from './level'
import MountainBackground from './Background'

const BLOCK_SIZE = 32
const WIDTH = 32
const HEIGHT = 32
const PLAYER_X = ~~(WIDTH / 2) + 1
const PLAYER_Y = HEIGHT - 15
const PLAYER_MAX_VELOCITY = 32
const level = new Level(WIDTH + 2, HEIGHT + 2)

export default {
  name: 'field',
  components: { MountainBackground },
  data () {
    return {
      x: 0,
      y: 0,
      // transform: translate(x,y); max 32px, then this.x++ / this.y++
      translate_x: 0,
      translate_y: 0,
      player_x: PLAYER_X,
      player_y: PLAYER_Y,
      player_direction: 'left',
      player_velocity_x: 0,
      player_velocity_y: 0,
      drag: 1
    }
  },
  mounted () {
    this.mindTheGap()
  },
  watch: {
    player_velocity_x: throttle(function (v) {
      if (!v) return // zero velocity is not interesting

      // calculate with positive values but remember negative velocity
      const sign = v < 0 ? -1 : 1
      v *= sign

      if (v > 8) v = 8

      v -= this.drag
      if (v < 0) v = 0
      else v *= sign // back to original sign
      this.player_velocity_x = v
      this.translate_x += v
      console.log(v)
    }, 100),
    translate_x (tx) {
      this.x += Math.floor(tx / BLOCK_SIZE)
      this.translate_x = tx % BLOCK_SIZE
    },
    player_velocity_y (velocity_y) {
      //if (!velocity_y) return // zero velocity is not interesting
      return // TODO

      if (velocity_y < 0) {
        if (!this.blockBelowPlayer.walkable) this.player_velocity_y = 0
        else if (this.translate_y > -BLOCK_SIZE) this.translate_y += velocity_y
        else {
          this.translate_y = 0
          this.y++
        }
      } else {
        if (!this.blockAbovePlayer.walkable) this.player_velocity_y = 0
        else if (this.translate_y < BLOCK_SIZE) this.translate_y += velocity_y
      }
    }

  },
  computed: {
    rows () {
      return level.grid(this.x, this.y)
    },
    blockAtPlayer () {
      return this.rows[PLAYER_Y][PLAYER_X]
    },
    blockLeftOfPlayer () {
      return this.rows[PLAYER_Y][PLAYER_X - 1]
    },
    blockRightOfPlayer () {
      return this.rows[PLAYER_Y][PLAYER_X + 1]
    },
    blockAbovePlayer () {
      return this.rows[PLAYER_Y - 1][PLAYER_X]
    },
    blockBelowPlayer () {
      return this.rows[PLAYER_Y + 1][PLAYER_X]
    }
  },
  methods: {
    goDown (ev) {
      // TODO: this.player_direction = 'down'
      if (this.blockBelowPlayer.walkable) this.player_velocity_y -= 8
      this.mindTheGap()
    },
    goUp (ev) {
      // TODO: this.player_direction = 'up'
      if (this.blockAtPlayer.climbable) this.player_velocity_y += 8
    },
    goRight: throttle(function (ev) {
      if (this.blockRightOfPlayer.walkable) {
        this.player_velocity_x -= 4
      }
    }, 10),
    goLeft: throttle(function (ev) {
      if (this.blockLeftOfPlayer.walkable) {
        this.player_velocity_x += 4
      }
    }, 10),
    jump (ev) {
      if (this.blockAbovePlayer.walkable) {
        this.player_velocity_y += 64
        this.mindTheGap()
      }
    },
    mindTheGap () {
      const below = this.blockBelowPlayer
      if (below.walkable && !below.climbable) {
        this.player_velocity_y -= 8
      }
    }
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
