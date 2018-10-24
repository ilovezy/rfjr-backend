import Vue from 'vue'
import Router from 'vue-router'
import BaiscRouter from './modules/basicRoute'
import UserManage from './modules/userManage'
import BorrowManage from './modules/borrowManage'
import OpeManage from './modules/opeManage'
import FinanceManage from './modules/financeManage'
import DataStatistics from './modules/dataStatistics'
import Setting from './modules/setting'
import YeePayManage from './modules/yeePayManage'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'home', noCache: true }
    }]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/documentation/index'),
      name: 'documentation',
      meta: { title: 'documentation', icon: 'documentation', noCache: true }
    }]
  }
]

export const asyncRouterMap = [
  ...UserManage,
  ...FinanceManage,
  // ...BorrowManage,
  // ...OpeManage,
  // ...DataStatistics,
  // ...Setting,
  // ...YeePayManage,
  // ...BaiscRouter,
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap)
})
