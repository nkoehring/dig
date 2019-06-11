<template>
  <canvas ref="canvas" id="background"></canvas>
</template>

<script>
import solarQuartet from './solar-quartet'
import { BLOCK_SIZE, STAGE_WIDTH, STAGE_HEIGHT } from './level/def'

export default {
  name: 'background',
  props: {
    x: Number,
    time: Number
  },
  data () {
    return {
      redraw: null
    }
  },
  watch: {
    // x () { this.refresh() },
    time () { this.refresh() }
  },
  mounted () {
    const canvas = this.$refs.canvas
    const godraysCanvas = document.createElement('canvas')
    canvas.width = STAGE_WIDTH * BLOCK_SIZE
    canvas.height = STAGE_HEIGHT * BLOCK_SIZE
    godraysCanvas.width = ~~(canvas.width / 8.0)
    godraysCanvas.height = ~~(canvas.height / 8.0)
    this.redraw = solarQuartet.bind(
      null,
      canvas, canvas.getContext('2d'), ~~(canvas.width / 2.0), ~~(canvas.height / 2.0),
      godraysCanvas, godraysCanvas.getContext('2d'), godraysCanvas.width, godraysCanvas.height,
    )
    this.refresh()
  },
  computed: {
    /* time value to sun position conversion
     *
     * The time value rotates from 0 to 1000
     * sunY convertes it to values between 0 and -100,
     * while -100 is high sun position (aka day)
     * and 0 is low (aka night).
     * My adaption of Solar Quartet renders a static night sky from -30 upwards
     * and a static day at -70 or lower
     */
    sunY () {
      // time is between 0 and 1000
      const p = Math.PI / 1000
      return Math.sin(this.time * p) * -100
    }
  },
  methods: {
    refresh () {
      // console.time('draw background')
      this.redraw(this.x, this.sunY)
      // console.timeEnd('draw background')
    }
  }
}
</script>

<style>
#background {
  display: block;
  width: var(--field-width);
  height: var(--field-height);
  object-fit: contain;
  background: black;
}
</style>
