import Layout from '@/views/layout/Layout'


export default [
  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/svg-icons/index'),
      name: 'icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }]
  },

  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      {
        path: 'tinymce',
        component: () => import('@/views/components-demo/tinymce'),
        name: 'tinymce-demo',
        meta: { title: 'tinymce' }
      },
      {
        path: 'markdown',
        component: () => import('@/views/components-demo/markdown'),
        name: 'markdown-demo',
        meta: { title: 'markdown' }
      },
      {
        path: 'json-editor',
        component: () => import('@/views/components-demo/jsonEditor'),
        name: 'jsonEditor-demo',
        meta: { title: 'jsonEditor' }
      },
      {
        path: 'splitpane',
        component: () => import('@/views/components-demo/splitpane'),
        name: 'splitpane-demo',
        meta: { title: 'splitPane' }
      },
      {
        path: 'avatar-upload',
        component: () => import('@/views/components-demo/avatarUpload'),
        name: 'avatarUpload-demo',
        meta: { title: 'avatarUpload' }
      },
      {
        path: 'dropzone',
        component: () => import('@/views/components-demo/dropzone'),
        name: 'dropzone-demo',
        meta: { title: 'dropzone' }
      },
      {
        path: 'sticky',
        component: () => import('@/views/components-demo/sticky'),
        name: 'sticky-demo',
        meta: { title: 'sticky' }
      },
      {
        path: 'count-to',
        component: () => import('@/views/components-demo/countTo'),
        name: 'countTo-demo',
        meta: { title: 'countTo' }
      },
      {
        path: 'mixin',
        component: () => import('@/views/components-demo/mixin'),
        name: 'componentMixin-demo',
        meta: { title: 'componentMixin' }
      },
      {
        path: 'back-to-top',
        component: () => import('@/views/components-demo/backToTop'),
        name: 'backToTop-demo',
        meta: { title: 'backToTop' }
      },
      {
        path: 'drag-dialog',
        component: () => import('@/views/components-demo/dragDialog'),
        name: 'dragDialog-demo',
        meta: { title: 'dragDialog' }
      },
      {
        path: 'dnd-list',
        component: () => import('@/views/components-demo/dndList'),
        name: 'dndList-demo',
        meta: { title: 'dndList' }
      },
      {
        path: 'drag-kanban',
        component: () => import('@/views/components-demo/dragKanban'),
        name: 'dragKanban-demo',
        meta: { title: 'dragKanban' }
      }
    ]
  },

  {
    path: '/table',
    component: Layout,
    redirect: '/table/complex-table',
    name: 'table',
    meta: {
      title: 'Table',
      icon: 'table'
    },
    children: [
      {
        path: 'dynamic-table',
        component: () => import('@/views/table/dynamicTable/index'),
        name: 'dynamicTable',
        meta: { title: 'dynamicTable' }
      },
      {
        path: 'drag-table',
        component: () => import('@/views/table/dragTable'),
        name: 'dragTable',
        meta: { title: 'dragTable' }
      },
      {
        path: 'inline-edit-table',
        component: () => import('@/views/table/inlineEditTable'),
        name: 'inlineEditTable',
        meta: { title: 'inlineEditTable' }
      },
      {
        path: 'tree-table',
        component: () => import('@/views/table/treeTable/treeTable'),
        name: 'treeTableDemo',
        meta: { title: 'treeTable' }
      },
      {
        path: 'custom-tree-table',
        component: () => import('@/views/table/treeTable/customTreeTable'),
        name: 'customTreeTableDemo',
        meta: { title: 'customTreeTable' }
      },
      {
        path: 'complex-table',
        component: () => import('@/views/table/complexTable'),
        name: 'complexTable',
        meta: { title: 'complexTable' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'createArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'editArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'articleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

]
