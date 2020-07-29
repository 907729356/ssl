import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }

  constantRouterMap 是默认菜单
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/materiel',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'materielManage',
    meta: {
      title: '药品管理',
      icon: 'table'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/materiel/create'),
        name: 'materielCreate',
        meta: {
          perms: ['GET /admin/drug/application/querySave', 'POST /admin/drug/application/commit', 'POST /admin/drug/application/add', 'POST /admin/drug/application/delete'],
          title: '提交',
          hidden: true,
          noCache: true
        }
      },
      {
        path: 'list',
        component: () => import('@/views/materiel/list'),
        name: 'materielList',
        meta: {
          perms: ['GET /admin/drug/application/queryLab'],
          title: '申请列表',
          noCache: true
        }
      },
      {
        path: 'station',
        component: () => import('@/views/materiel/station'),
        name: 'stationlist',
        meta: {
          perms: ['GET /admin/drug/application/queryCommited', 'POST /admin/drug/application/confirm'],
          title: '中转站',
          noCache: true
        }
      },
      {
        path: 'department',
        component: () => import('@/views/materiel/department'),
        name: 'departmentList',
        meta: {
          perms: ['POST /admin/drug/application/pass', 'GET /admin/drug/application/queryAll'],
          title: '总务处',
          noCache: true
        }
      },
      {
        path: 'add',
        component: () => import('@/views/materiel/add'),
        name: 'materielAdd',
        meta: {
          perms: ['POST /admin/drug/dic/add'],
          title: '新增药剂',
          noCache: true
        }
      },
    ]
  },
  
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '用户管理',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete', 'GET /admin/role/permissions', 'POST /admin/role/permissions'],
          title: '角色管理',
          noCache: true
        }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
