import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/yeePayManage',
    component: Layout,
    redirect: '/yeePayManage/BusinessTypeManage',
    alwaysShow: true, // will always show the root menu
    name: 'yeePayManage',
    meta: {
      title: '易宝管理',
      icon: 'nested'
    },
    children: [{
      path: 'YeePayManage',
      component: () => import('@/views/yeePayManage/YeePayManage'),
      name: 'YeePayManage',
      meta: {
        title: '易宝查询'
      }
    },]
  }
]
