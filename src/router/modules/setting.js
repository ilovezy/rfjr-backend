import Layout from '@/views/layout/Layout'

export default [
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/BusinessTypeManage',
    alwaysShow: true, // will always show the root menu
    name: 'setting',
    meta: {
      title: '系统配置',
      icon: 'setting'
    },
    children: [{
      path: 'CharacterManage',
      component: () => import('@/views/setting/CharacterManage'),
      name: 'CharacterManage',
      meta: {
        title: '角色管理'
      }
    }, {
      path: 'CharacterManageEdit/:id',
      component: () => import('@/views/setting/CharacterManageEdit'),
      name: 'CharacterManageEdit',
      meta: {
        title: '角色管理'
      },
      hidden: true
    }, {
      path: 'UserManage',
      component: () => import('@/views/setting/UserManage'),
      name: 'UserManage',
      meta: {
        title: '系统账户管理'
      }
    }, {
      path: 'UserManageEdit/:id',
      component: () => import('@/views/setting/UserManageEdit'),
      name: 'UserManageEdit',
      meta: {
        title: '系统账户管理'
      },
      hidden: true
    }, {
      path: 'MenuManage',
      component: () => import('@/views/setting/MenuManage'),
      name: 'MenuManage',
      meta: {
        title: '菜单管理'
      }
    }, {
      path: 'DictManage',
      component: () => import('@/views/setting/DictManage'),
      name: 'DictManage',
      meta: {
        title: '字典管理'
      }
    }]
  }
]
