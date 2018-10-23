import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/dataStatistics',
    component: Layout,
    redirect: '/dataStatistics/BusinessTypeManage',
    alwaysShow: true, // will always show the root menu
    name: 'dataStatistics',
    meta: {
      title: '数据统计',
      icon: 'chart',
    },
    children: [{
      path: 'Business',
      component: () => import('@/views/dataStatistics/Business'),
      name: 'Business',
      meta: {
        title: '业务统计'
      }
    }, {
      path: 'Channel',
      component: () => import('@/views/dataStatistics/Channel'),
      name: 'Channel',
      meta: {
        title: '渠道统计'
      }
    }, {
      path: 'ChannelDetail/:id',
      component: () => import('@/views/dataStatistics/ChannelDetail'),
      name: 'ChannelDetail',
      meta: {
        title: '渠道明细'
      }
    }, {
      path: 'Income',
      component: () => import('@/views/dataStatistics/Income'),
      name: 'Income',
      meta: {
        title: '收入统计'
      }
    },]
  },
]
