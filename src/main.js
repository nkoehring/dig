import Vue from 'vue'
import App from './App.vue'

Vue.directive('keep-focussed', {
  inserted (el, binding) {
    el.focus()
    el.addEventListener('blur', () => el.focus())
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
