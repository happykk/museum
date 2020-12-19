import Mod from './index.vue'
import Item from './item.vue'
Mod.install = function (Vue) {
  Vue.component(Mod.name, Mod)
  Vue.component(Item.name, Item)
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(Mod.name, Mod)
  window.Vue.component(Item.name, Item)
}

export default Mod
