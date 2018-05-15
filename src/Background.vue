<template>
  <canvas ref="canvas" id="background"></canvas>
</template>

<script>
import solarQuartet from './solar-quartet'

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
    const canvasSize = 512
    const godraysSize = 128
    const canvas = this.$refs.canvas
    const godraysCanvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    godraysCanvas.width = godraysSize
    godraysCanvas.height = godraysSize
    this.redraw = solarQuartet.bind(
      null,
      canvas, canvas.getContext('2d'), canvasSize, canvasSize,
      godraysCanvas, godraysCanvas.getContext('2d'), godraysSize, godraysSize,
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
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: black;
}
</style>
