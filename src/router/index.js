import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login.vue'
import NotFound from '../views/404.vue'
import NoPermission from '../views/403.vue'
import Home from '../views/home.vue'
import Products from '../views/products/Products.vue'
import Songs from '../views/songs/Songs.vue'
import Packages from '../views/packages/Packages.vue'
import Operation from '../views/operation/Operation.vue'
import FeedBack from '../views/feedback/FeedBack.vue'
import User from '../views/user/User.vue'
import Vod from '../views/vod/Vod.vue'
import Data from '../views/data/Data.vue'

Vue.use(Router);

const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  
  {
    path: '/',
    redirect: '/products',
    name: 'home',
    component: Home
  },
  {
    path: '/',
    name: 'products',
    component: Home,
    children: [
      {path: '/products', component: Products, name: '产品信息', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/',
    name: 'songs',
    component: Home,
    children: [
      {path: '/songs', component: Songs, name: '歌库信息', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/',
    name: 'packages',
    component: Home,
    children: [
      {path: '/packages', component: Packages, name: '套餐管理', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/',
    name: 'operation',
    component: Home,
    children: [
      {path: '/operation', component: Operation, name: '运营管理', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/',
    name: 'feedback',
    component: Home,
    children: [
      {path: '/feedback', component: FeedBack, name: '用户反馈', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/',
    name: 'user',
    component: Home,
    children: [
      {path: '/user', component: User, name: '账号管理', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/',
    name: 'vod',
    component: Home,
    children: [
      {path: '/vod', component: Vod, name: 'VOD管理', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/',
    name: 'data',
    component: Home,
    children: [
      {path: '/data', component: Data, name: '数据分析', meta: {requireAuth: 1}}
    ]
  },
  {
    path: '/403',
    name: 'noPermission',
    component: NoPermission
  },
  {
    path: '/*',
    name: 'notFound',
    component: NotFound
  }
];

export default new Router({
  routes: constantRouterMap
})
