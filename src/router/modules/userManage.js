import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/AcInfo',
    alwaysShow: true, // will always show the root menu
    name: 'userManage',
    meta: {
      title: '会员管理',
      icon: 'peoples'
    },
    children: [{
      path: 'UserInfoList',
      component: () => import('@/views/userManage/UserInfoList'),
      name: 'UserInfoList',
      meta: {
        title: '会员列表',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    //   {
    //   path: 'LoanAccessAudit',
    //   component: () => import('@/views/userManage/LoanAccessAudit'),
    //   name: 'LoanAccessAudit',
    //   meta: {
    //     title: '借款准入审核',
    //     roles: ['admin'] // or you can only set roles in sub nav
    //   }
    // }, {
    //   path: 'BankCardManage',
    //   component: () => import('@/views/userManage/BankCardManage'),
    //   name: 'BankCardManage',
    //   meta: {
    //     title: '银行卡管理',
    //     roles: ['admin'] // or you can only set roles in sub nav
    //   }
    // },
    ]
  }

]
