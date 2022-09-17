﻿export default [
  {
    path: '/login',
    layout: false,
    component: './Basic/Login',
  },
  { path: '/account', component: './Basic/Account' },
  { path: '/dashboard', name: '仪盘', icon: 'DotChartOutlined', component: './Basic/Dashboard' },
  {
    name: '文章',
    icon: 'ReconciliationOutlined',
    path: '/article',
    access: 'routes',
    permission: 'site.article.paginate',
    component: './Site/Article/Paginate',
  },
  {
    name: '栏目',
    icon: 'AppstoreAddOutlined',
    path: '/category',
    access: 'routes',
    permission: 'site.category.tree',
    component: './Site/Category/Tree',
  },
  {
    name: '友链',
    icon: 'LinkOutlined',
    path: '/link',
    access: 'routes',
    permission: 'site.link.paginate',
    component: './Site/Link/Paginate',
  },
  {
    name: '账号',
    icon: 'TeamOutlined',
    path: '/admin',
    access: 'routes',
    permission: 'site.admin.paginate',
    component: './Site/Admin/Paginate',
  },
  {
    name: '角色',
    icon: 'BranchesOutlined',
    path: '/role',
    access: 'routes',
    permission: 'site.role.paginate',
    component: './Site/Role/Paginate',
  },
  {
    name: '权限',
    icon: 'NodeExpandOutlined',
    path: '/permission',
    access: 'routes',
    permission: 'site.permission.tree',
    component: './Site/Permission/Tree',
  },
  {
    name: '系统',
    icon: 'SettingOutlined',
    path: '/system',
    access: 'routes',
    permission: 'site.system.list',
    component: './Site/System',
  },
  { path: '/', redirect: '/dashboard' },
  { path: '/403', component: './Errors/403' },
  { component: './Errors/404' },
];
