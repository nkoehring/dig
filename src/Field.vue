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
  width: 30px;
  height: 30px;
  background-color: #6DA956;
  border: 1px solid transparent;
}
.block.air { background-color: #56F; }
.block.grass { background-color: #56F; height: 28px; border-bottom: 2px solid #0A0; }
.block.leaves { background-color: #383; }
.block.wood { background-color: #876; }
.block.soil { background-color: #543; }
.block.gravel { background-color: #665; }
.block.stone { background-color: #555; }
.block.bedrock { background-color: #333; }
.block.cave { background-color: #000; }
.block.player {
  background-image: url(./assets/dwarf.png);
  background-position: center;
  background-repeat: no-repeat;
}
.block:hover {
  border-color: rgba(255,255,255,0.2);
}
</style>
