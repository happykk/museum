import Vue from 'vue'
import Router from 'vue-router'
import Empty from '@/components/common/empty/empty.vue'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '/store-operation',
  routes: [{
    path: '/404',
    component: resolve => require(['@/components/common/404/404.vue'], resolve)
  }, {
    path: '/index',
    component: resolve => require(['@/components/conf/index/index.vue'], resolve)
  }, {
    path: '/material',
    component: resolve => require(['@/components/conf/material/index.vue'], resolve)
  }, {
    path: '/searchGood',
    component: resolve => require(['@/components/conf/search-goods/index.vue'], resolve)
  }, {
    path: '/coupon',
    component: Empty,
    name: '优惠券',
    redirect: '/coupon/list',
    children: [
      {
        path: 'list',
        component: resolve => require(['@/components/conf/coupon/list.vue'], resolve)
      },
      {
        path: 'detail',
        component: resolve => require(['@/components/conf/coupon/detail.vue'], resolve)
      }
    ]
  }, {
    path: '/group-portrait',
    component: resolve => require(['@/components/conf/group-portrait/index.vue'], resolve)
  }, {
    path: '/consume-detail',
    component: resolve => require(['@/components/conf/consume-detail/index.vue'], resolve)
  }, {
    path: '/change-shop',
    component: resolve => require(['@/components/conf/change-shop/index.vue'], resolve)
  }]
})
export default router
