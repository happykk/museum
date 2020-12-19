<template>
  <div class="mod-index">
    <ul>
      <li class="mod-test">{{ title }}</li>
      <li class="mod-hd">字体图标<span class="iconfontcom">&#xe600;</span></li>
    </ul>
    <mk-nav v-model="show" color="#bab4b3" selected-color="#fe7773">
      <mk-nav-item icon-class="iconfontmod" icon="&#xe798;" text="默认" selected></mk-nav-item>
      <mk-nav-item icon-class="iconfontcom" icon="&#xe601;" text="加点" dot></mk-nav-item>
    </mk-nav>
  </div>
</template>

<script>
import Vue from 'vue'
import Nav from '@/components/common/nav'
Vue.use(Nav)
export default {
  data () {
    return {
      title: 'Hello world',
      show: true
    }
  },
  created () {
  }
}
</script>

<style scoped lang="scss">
.mod-index {
  color:red;
  font-size: 20px;
  .mod-hd {
    font-size:22px;
  }
}
</style>
