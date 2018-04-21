<template>
  <div class="field">
    <input v-keep-focussed type="text"
      @keydown.down="goDown($event)"
      @keydown.up="goUp($event)"
      @keydown.right="x = x + 1"
      @keydown.left="x = x > 0 ? x - 1 : 0"
    />
    <template v-for="row in rows">
      <div v-for="block in row" class="block" :class="block.type" />
    </template>
  </div>
</template>

<script>
import Level from './lib/level-generator'

const WIDTH = 32
const HEIGHT = 32
const level = new Level(WIDTH, HEIGHT)

export default {
  name: 'field',
  data () {
    return {
      x: 0,
      y: 0
    }
  },
  computed: {
    rows () {
      return level.grid(this.x, this.y)
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
    }
  }
}
</script>

<style>
.field {
  display: flex;
  flex-flow: row wrap;
  width: 1024px;
  margin: auto;
  margin-top: calc(100vh - 1056px);
  border: 16px solid #222;
}
.field > input {
  position: absolute;
  opacity: 0;
  display: block;
  width: 1px;
  height: 1px;
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
.block:hover {
  border-color: rgba(255,255,255,0.2);
}
</style>
