import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/financeManage',
    component: Layout,
    redirect: '/financeManage/BusinessTypeManage',
    alwaysShow: true, // will always show the root menu
    name: 'financeManage',
    meta: {
      title: '财务管理',
      icon: 'money',
    },
    children: [{
      path: 'RechargeRecord',
      component: () => import('@/views/financeManage/RechargeRecord'),
      name: 'RechargeRecord',
      meta: {
        title: '充值记录'
      }
    },{
      path: 'WithdrawRecord',
      component: () => import('@/views/financeManage/WithdrawRecord'),
      name: 'WithdrawRecord',
      meta: {
        title: '提现记录'
      }
    },]
  },
]
