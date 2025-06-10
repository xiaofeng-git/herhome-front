import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'
import ProductList from '../components/admin/ProductList.vue'
import MinsuList from '../components/admin/minsuList.vue'
import CleanList from '../components/admin/CleanList.vue'
import CompensateList from '../components/admin/CompensateList.vue'
import RepairList from '../components/admin/RepairList.vue'
import BuyList from '../components/admin/BuyList.vue'

import Main from '../components/money/DashBoard.vue'

const routes = [
  {
    path: '/',
    redirect:"/login"
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: "/welcome",
    children:[
      {
        path:'/welcome',
        component: Welcome,
      },
      {
        path:'/user',
        component: UserList,
      },
      {
        path:'/product',
        component: ProductList,
      },
      {
        path:'/minsu',
        component: MinsuList,
      },
      {
        path:'/clean',
        component: CleanList,
      },
      {
        path:'/compensate',
        component: CompensateList,
      },
      {
        path:'/repair',
        component: RepairList,
      },
      {
        path:'/buy',
        component: BuyList,
      },
      {
        path:'/main',
        component: Main,
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to 将要访问
  // from 从哪访问
  // next 接下来做next(url)
  if(to.path == '/login') return next();
  // 获取user
  const userFlag = window.sessionStorage.getItem("user"); // 获取session存储的user
  if(!userFlag) return next('/login'); // 无user返回登录页面
  next(); 
})

export default router
