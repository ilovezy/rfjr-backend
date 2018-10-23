import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/borrowManage',
    component: Layout,
    redirect: '/borrowManage/BannerManage',
    alwaysShow: true, // will always show the root menu
    name: 'borrowManage',
    meta: {
      title: '借款管理',
      icon: 'list'
    },
    children: [{
      path: 'BorrowingOrder',
      component: () => import('@/views/borrowManage/BorrowingOrder'),
      name: 'BorrowingOrder',
      meta: {
        title: '借款中的订单'
      }
    },{
      path: 'RepayingOrder',
      component: () => import('@/views/borrowManage/RepayingOrder'),
      name: 'RepayingOrder',
      meta: {
        title: '还款中的订单'
      }
    },{
      path: 'OverdueOrder',
      component: () => import('@/views/borrowManage/OverdueOrder'),
      name: 'OverdueOrder',
      meta: {
        title: '逾期的订单'
      }
    },{
      path: 'RepayedOrder',
      component: () => import('@/views/borrowManage/RepayedOrder'),
      name: 'RepayedOrder',
      meta: {
        title: '已还款的订单'
      }
    },{
      path: 'BorrowFailOrder',
      component: () => import('@/views/borrowManage/BorrowFailOrder'),
      name: 'BorrowFailOrder',
      meta: {
        title: '借款失败的订单'
      }
    },]
  }
]
