import Vue from 'vue'
import Router from 'vue-router'
import Empty from '@/components/common/empty/empty.vue'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '/museum',
  routes: [{
    path: '/404',
    component: resolve => require(['@/components/common/404/404.vue'], resolve)
  }, {
    path: '/index',
    component: resolve => require(['@/components/conf/index/index.vue'], resolve)
  }, {
    path: '/appointment',
    component: Empty,
    name: '参观预约',
    redirect: '/appointment/index',
    children: [
      {
        path: 'index',
        component: resolve => require(['@/components/conf/appointment/index.vue'], resolve)
      },
      {
        path: 'detail',
        component: resolve => require(['@/components/conf/appointment/detail.vue'], resolve)
      },
      {
        path: 'my-ticket',
        component: resolve => require(['@/components/conf/appointment/my-ticket.vue'], resolve)
      }
    ]
  }, {
    path: '/guest-book',
    name: '留言簿',
    component: resolve => require(['@/components/conf/guest-book/index.vue'], resolve)
  }, {
    path: '/display-list',
    name: '基本陈列',
    component: Empty,
    redirect: '/display-list/index',
    children: [
      {
        path: 'index',
        component: resolve => require(['@/components/conf/display-list/index.vue'], resolve)
      },
      {
        path: 'detail',
        component: resolve => require(['@/components/conf/display-list/detail.vue'], resolve)
      },
      {
        path: 'cate-detail',
        component: resolve => require(['@/components/conf/display-list/cate-detail.vue'], resolve)
      },
      {
        path: 'pro-detail',
        component: resolve => require(['@/components/conf/display-list/pro-detail.vue'], resolve)
      }
    ]
  }]
})
export default router
