import site from "../routes/site";
import blog from "../routes/blog";

export default [
  {
    path: '/login',
    layout: false,
    component: './Basic/Login',
  },
  {path: '/account', component: './Basic/Account'},
  {path: '/dashboard', name: '仪盘', icon: 'DotChartOutlined', component: './Basic/Dashboard'},
  ...blog,
  ...site,
  {path: '/', redirect: '/dashboard'},
  {path: '/403', component: './Errors/403'},
  {component: './Errors/404'},
];
