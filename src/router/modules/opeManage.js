import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/opeManage',
    component: Layout,
    redirect: '/opeManage/BannerManage',
    alwaysShow: true, // will always show the root menu
    name: 'opeManage',
    meta: {
      title: '运营管理',
      icon: 'example'
    },
    children: [{
      path: 'BannerManage',
      component: () => import('@/views/opeManage/BannerManage'),
      name: 'BannerManage',
      meta: {
        title: 'Banner管理'
      }
    },{
      path: 'LoanContractManage',
      component: () => import('@/views/opeManage/LoanContractManage'),
      name: 'LoanContractManage',
      meta: {
        title: '借款合同管理'
      }
    }, {
      path: 'NoticeManage',
      component: () => import('@/views/opeManage/NoticeManage'),
      name: 'NoticeManage',
      meta: {
        title: '公告管理'
      }
    }, {
      path: 'BankManage',
      component: () => import('@/views/opeManage/BankManage'),
      name: 'BankManage',
      meta: {
        title: '银行维护'
      }
    },]
  }
]
