import Mod from './index.vue'
import List from './list.vue'
Mod.install = function (Vue) {
  Vue.component(Mod.name, Mod)
  Vue.component(List.name, List)
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(Mod.name, Mod)
  window.Vue.component(List.name, List)
}

export default Mod
