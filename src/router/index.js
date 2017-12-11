import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Home from '@/components/Home'
import Announce from '@/components/Announce'
import Complain from '@/components/Complain'
import Repair from '@/components/Repair'
import Login from '@/components/Login'
import Device from '@/components/Device'
import Household from '@/components/Household'
import Common from '@/components/Common'
import Open from '@/components/Open'
import Remove from '@/components/Remove'
import Hijack from '@/components/Hijack'
import Visitor from '@/components/Visitor'

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
        },
        {
          path: 'device',
          name: '设备管理',
          component: Device
        },
        {
          path: 'household',
          name: '门禁管理 - 住户管理',
          component: Household
        },
        {
          path: 'common',
          name: '门禁管理 - 公卡管理',
          component: Common
        },
        {
          path: 'open',
          name: '日志管理 - 开门日志',
          component: Open
        },
        {
          path: 'remove',
          name: '日志管理 - 防拆日志',
          component: Remove
        },
        {
          path: 'hijack',
          name: '日志管理 - 劫持报警日志',
          component: Hijack
        },
        {
          path: 'visitor',
          name: '日志管理 - 访客日志',
          component: Visitor
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
