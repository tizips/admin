export default [
  {
    name: '文章',
    icon: 'ReconciliationOutlined',
    path: '/blog/article',
    access: 'routes',
    permission: 'blog.article.paginate',
    component: '@/pages/Blog/Article/Paginate',
  },
  {
    name: '栏目',
    icon: 'AppstoreAddOutlined',
    path: '/blog/category',
    access: 'routes',
    permission: 'blog.category.tree',
    component: '@/pages/Blog/Category/Tree',
  },
  {
    name: '友链',
    icon: 'LinkOutlined',
    path: '/blog/link',
    access: 'routes',
    permission: 'blog.link.paginate',
    component: '@/pages/Blog/Link/Paginate',
  },
  {
    name: '设置',
    icon: 'SettingOutlined',
    path: '/blog/system',
    access: 'routes',
    permission: 'blog.system.info',
    component: '@/pages/Blog/Setting',
  },
]
