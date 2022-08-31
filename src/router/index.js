import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'
/* nested */
// import nested from '@/layout/nested' // 为了嵌套路由

/* Router Modules */
import buildRouter from './modules/build'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/index',
    name: 'Dashboard',
    component: Layout,
    meta: {
      title: 'Dashboard',
      icon: '1'
      // roles: [] // you can set roles in root nav
    },
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Dashboard',
        icon: '1'
      },
    }]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  buildRouter,
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    base: '/',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// fix: Error: Redirected when going from "/login?redirect=%2Ftemplate%2Fdetail" to "/template/detail" via a navigation guard.
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

export default router
