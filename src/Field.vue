<template>
  <div class="field" @click="handleClick">
    <input v-keep-focussed type="text"
      @keydown.down="goDown($event)"
      @keydown.up="goUp($event)"
      @keydown.right="goRight($event)"
      @keydown.left="goLeft($event)"
      @keydown.space="jump($event)"
    />
    <div id="level-indicator">x:{{ x }}, y:{{ y }}</div>
    <div id="player" :class="[player_direction]" :data-x="player_x" :data-y="player_y" />
    <template v-for="(row, y) in rows">
      <div v-for="(block, x) in row" class="block" :class="[block.type]" :data-x="x" :data-y="y" />
    </template>
  </div>
</template>

<script>
import Level from './level'

const WIDTH = 32
const HEIGHT = 32
const PLAYER_X = ~~(WIDTH / 2) - 1
const PLAYER_Y = HEIGHT - 16
const level = new Level(WIDTH, HEIGHT)

export default {
  name: 'field',
  data () {
    return {
      x: 0,
      y: 0,
      player_x: PLAYER_X,
      player_y: PLAYER_Y,
      player_direction: 'left',
      walk_steps_x: 0,
      walk_steps_y: 0
    }
  },
  mounted () {
    this.mindTheGap()
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
    blockBelowPlayer () {
      return this.rows[PLAYER_Y + 1][PLAYER_X]
    }
  },
  methods: {
    goDown (ev) {
      // TODO: this.player_direction = 'down'
      if (this.blockBelowPlayer.walkable) this.y++
      this.mindTheGap()
    },
    goUp (ev) {
      // TODO: this.player_direction = 'up'
      if (this.blockAtPlayer.climbable) this.y--
    },
    goRight (ev) {
      if (this.player_direction !== 'right') {
        this.player_direction = 'right'
      } else if (this.blockRightOfPlayer.walkable) {
        this.x++
        this.mindTheGap()
      }
    },
    goLeft (ev) {
      if (this.player_direction !== 'left') {
        this.player_direction = 'left'
      } else if (this.blockLeftOfPlayer.walkable) {
        this.x--
        this.mindTheGap()
      }
    },
    jump (ev) {
      this.y--
      if (this.player_direction === 'left' && this.blockLeftOfPlayer.walkable) {
        this.x--
        setTimeout(() => {
          if (this.blockLeftOfPlayer.walkable) this.x--
          if (this.blockBelowPlayer.walkable) this.y++
        }, 50)
      } else if (this.player_direction === 'right' && this.blockRightOfPlayer.walkable) {
        this.x++
        setTimeout(() => {
          if (this.blockRightOfPlayer.walkable) this.x++
          if (this.blockBelowPlayer.walkable) this.y++
        }, 50)
      }
      // just jump while facing the back
      setTimeout(() => this.mindTheGap(), 100)
    },
    walkSteps () {
      if (!this.walk_steps_x && !this.walk_steps_y) return

      if (this.walk_steps_x > 0) {
        this.goLeft()
        this.walk_steps_x--
      } else if (this.walk_steps_x < 0) {
        this.goRight()
        this.walk_steps_x++
      } else if (this.walk_steps_y > 0) {
        this.goUp()
        this.walk_steps_y--
      } else if (this.walk_steps_y < 0) {
        this.goDown()
        this.walk_steps_y++
      }
      setTimeout(() => this.walkSteps(), 100)
    },
    handleClick (ev) {
      const coords = ev.target.dataset
      this.walk_steps_x = this.player_x - parseInt(coords.x)
      this.walk_steps_y = this.player_y - parseInt(coords.y)
      this.walkSteps()
    },
    mindTheGap () {
      const below = this.blockBelowPlayer
      if (below.walkable && !below.climbable) {
        this.y++
        setTimeout(() => this.mindTheGap(), 50)
      }
    }
  }
}
</script>

<style>
.field {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 1024px;
  margin: auto;
}
.field > input {
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
  left: calc(32px * 15);
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
.block         { background-color: #56F; }
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

.block.soil    { background-image: url(./assets/soil01.png); }
.block.soil_gravel { background-image: url(./assets/soil_gravel01.png); }
.block.stone_gravel { background-color: #444; /* background-image: url(./assets/soil_gravel01.png) */; }
.block.stone   { background-image: url(./assets/rock.png); }
.block.bedrock { background-image: url(./assets/bedrock.png); }
.block.cave    { background-color: #000; }
.block:hover, .block.highlight { filter: brightness(1.4); }
</style>
