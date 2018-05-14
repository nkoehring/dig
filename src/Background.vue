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
    sunY () {
      // time is between 0 and 1000
      const p = Math.PI / 1000
      return Math.sin(this.time * p) * -100
    }
  },
  methods: {
    refresh () {
      this.redraw(this.x, this.sunY)
      this.timeout = setTimeout(() => this.refresh(), 50)
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
