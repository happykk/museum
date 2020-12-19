import Mod from './index.vue'
Mod.install = function (Vue) {
  Vue.component(Mod.name, Mod)
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(Mod.name, Mod)
}

export default Mod
