<template>
  <div id="building-game">
    <Field />
  </div>
</template>

<script>
import Field from './Field'

export default {
  name: 'building-game',
  components: { Field },
  data () {
    return {
    }
  }
}
</script>

<style>
html,body,#app {
  display: block;
  width: 100vw;
  height: 100vh;
  background: black;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

</style>
