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
    },{
      path: 'InviteManage',
      component: () => import('@/views/userManage/InviteManage'),
      name: 'InviteManage',
      meta: {
        title: '代理管理',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },{
      path: 'ForgetPwdList',
      component: () => import('@/views/userManage/ForgetPwdList'),
      name: 'ForgetPwdList',
      meta: {
        title: '忘记密码管理',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    ]
  }

]
