import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Home from '@/components/Home'
import Announce from '@/components/Announce'
import Complain from '@/components/Complain'
import Repair from '@/components/Repair'
import Login from '@/components/Login'

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/', redirect: '/wk/home'},
    {
      path: '/wk',
      name: 'Hello',
      component: Hello,
      children: [
        {
          path: 'home',
          name: '首页',
          component: Home
        },
        {
          path: 'announce',
          name: '物业中心 - 公告管理',
          component: Announce
        },
        {
          path: 'complain',
          name: '物业中心 - 投诉',
          component: Complain
        },
        {
          path: 'repair',
          name: '物业中心 - 维修',
          component: Repair
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
