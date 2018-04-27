<template>
  <canvas ref="canvas" id="background"></canvas>
</template>

<script>
import solarQuartet from './solar-quartet'

export default {
  name: 'background',
  props: {
    x: Number
  },
  data () {
    return {
      sunY: -50.0,
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
    this.redraw(this.x, this.sunY)
  },
  watch: {
    x (x) {
      this.redraw(x, this.sunY)
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
