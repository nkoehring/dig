<template>
  <div class="field">
    <input v-keep-focussed type="text"
      @keydown.down="goDown($event)"
      @keydown.up="goUp($event)"
      @keydown.right="goRight($event)"
      @keydown.left="goLeft($event)"
    />
    <div id="level-indicator">x:{{ x }}, y:{{ y }}</div>
    <template v-for="row in rows">
      <div v-for="block in row" class="block" :class="[block.type, block.background]" />
    </template>
  </div>
</template>

<script>
import Level from './level'

const WIDTH = 32
const HEIGHT = 32
const level = new Level(WIDTH, HEIGHT)

export default {
  name: 'field',
  data () {
    return {
      x: 0,
      y: 0,
      player_x: 0,
      player_y: 0
    }
  },
  mounted () {
    this.findStartPos()
  },
  computed: {
    rows () {
      return level.grid(this.x, this.y, this.player_x, this.player_y)
    }
  },
  methods: {
    goDown (ev) {
      if (ev.shiftKey) this.y += 32
      else this.y++
    },
    goUp (ev) {
      if (ev.shiftKey) this.y -= 32
      else this.y--
      this.y = Math.max(0, this.y)
    },
    goRight (ev) {
      if (ev.shiftKey) this.x += 32
      else this.x++
    },
    goLeft (ev) {
      if (ev.shiftKey) this.x -= 32
      else this.x--
    },
    findStartPos () {
      const x = parseInt(WIDTH / 2)

      for (let y = HEIGHT - 1; y; y--) {
        const block = this.rows[y][x]
        if (block.walkable) {
          this.player_x = x
          this.player_y = y
          break
        }
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
.block {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  background-color: #56F;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.block.air     { background-color: #56F; }
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
.block.player  { background-image: url(./assets/dwarf.png); }
.block:hover   { filter: brightness(1.4); }
</style>
