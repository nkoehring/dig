<template>
  <div class="block" :class="type"></div>
</template>

<script>
export default {
  name: 'block',
  props: {
    type: String
  },
  data () {
    return {
    }
  }
}
</script>

<style>
.block {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  background-color: #6DA956;
  border: 1px solid transparent;
}
.block.air { background-color: #33A; }
.block.grass { background-color: #33A; height: 28px; border-bottom: 2px solid #0A0; }
.block.soil { background-color: #543; }
.block.gravel { background-color: #665; }
.block.stone { background-color: #555; }
.block.bedrock { background-color: #444; }
.block:hover {
  border-color: rgba(255,255,255,0.2);
}
</style>
