import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { isLogin } from '@/utils'
import Layout from '@/layout/index.vue'

import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/shopCalendar',
    component: Layout,
    children: [
      {
        name: 'ShopCalendar',
        path: 'shopCalendar',
        component: () =>
          import(
            /* webpackChunkName: "ShopCalendar" */ '@/views/ShopCalendar/index.vue'
          ),
        meta: {
          title: '工作日历',
          permission: '1'
        }
      },
      {
        name: 'AllItems',
        path: 'allItems',
        component: () =>
          import(
            /* webpackChunkName: "AllItems" */ '@/views/AllItems/index.vue'
          ),
        meta: {
          title: '所有项目',
          permission: '2'
        }
      },
      {
        name: 'ArchivedItems',
        path: 'archivedItems',
        component: () =>
          import(
            /* webpackChunkName: "ArchivedItems" */ '@/views/ArchivedItems/index.vue'
          ),
        meta: {
          title: '归档项目',
          permission: '3'
        }
      },
      {
        name: 'CompanyItems',
        path: 'companyItems',
        component: () =>
          import(
            /* webpackChunkName: "CompanyItems" */ '@/views/CompanyItems/index.vue'
          ),
        meta: {
          title: '公司项目',
          permission: '4'
        }
      },
      {
        name: 'Job',
        path: 'job',
        component: () =>
          import(/* webpackChunkName: "Job" */ '@/views/Job/index.vue'),
        meta: {
          title: '在职人员安排',
          permission: '5'
        }
      },
      {
        name: 'Painter',
        path: 'painter',
        component: () =>
          import(/* webpackChunkName: "Job" */ '@/views/Painter/index.vue'),
        meta: {
          title: '外发画师安排',
          permission: '6'
        }
      },
      {
        name: 'Receipt',
        path: 'receipt',
        component: () =>
          import(/* webpackChunkName: "Job" */ '@/views/Receipt/index.vue'),
        meta: {
          title: '发票和收据',
          permission: '7'
        }
      },
      {
        name: 'EmployeeInfo',
        path: 'employeeInfo',
        component: () =>
          import(
            /* webpackChunkName: "Job" */ '@/views/EmployeeInfo/index.vue'
          ),
        meta: {
          title: '员工资料',
          permission: '8'
        }
      },
      {
        name: 'PainterInfo',
        path: 'painterInfo',
        component: () =>
          import(/* webpackChunkName: "Job" */ '@/views/PainterInfo/index.vue'),
        meta: {
          title: '外发画师资料',
          permission: '9'
        }
      },
      {
        name: 'Payroll',
        path: 'payroll',
        component: () =>
          import(/* webpackChunkName: "Job" */ '@/views/Payroll/index.vue'),
        meta: {
          title: '工资表',
          permission: '10'
        }
      },
      {
        name: 'CooperativeCompany',
        path: 'cooperativeCompany',
        component: () =>
          import(
            /* webpackChunkName: "Job" */ '@/views/CooperativeCompany/index.vue'
          ),
        meta: {
          title: '合作甲方信息',
          permission: '11'
        }
      },
      {
        name: 'AdministrationCost',
        path: 'administrationCost',
        component: () =>
          import(
            /* webpackChunkName: "Job" */ '@/views/AdministrationCost/index.vue'
          ),
        meta: {
          title: '管理成本',
          permission: '12'
        }
      },
      {
        name: 'Settings',
        path: 'settings',
        component: () =>
          import(/* webpackChunkName: "Job" */ '@/views/Settings/index.vue'),
        meta: {
          title: '后台设置',
          permission: '13'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () =>
      import(/* webpackChunkName: "NotFound" */ '@/views/NotFound/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const permissionInfo: any = store.state.userInfo
  if (to.name === 'NotFound') {
    next()
  } else if (to.name !== 'Login') {
    // 需要验证登录状态
    if (isLogin()) {
      // 已经登录
      // 路由权限控制
      if (
        (permissionInfo && permissionInfo.type === '1') ||
        !to.meta ||
        !to.meta.permission
      ) {
        // 超管不需要鉴权，判断路由是否配置 permission，没有配置不需要鉴权
        next()
      } else {
        // 获取权限列表
        let permission: Array<any> = []
        try {
          permission = JSON.parse(permissionInfo.permission)
        } catch (err) {
          permission = []
        }
        if (permission.indexOf(to.meta.permission) > -1) {
          next()
        } else {
          // 跳转第一个页面时候,需要判断当前页面是否存在权限，存在跳转，不存在去路由查找第一个有权限的页面
          if (to.name === 'ShopCalendar') {
            // 路由表查找
            const layoutList = routes[0].children as Array<any>
            let pageName = ''
            for (let i = 0; i < layoutList.length; i++) {
              if (
                layoutList[i] &&
                layoutList[i].meta &&
                layoutList[i].meta.permission
              ) {
                if (permission.indexOf(layoutList[i].meta.permission) > -1) {
                  pageName = layoutList[i].name
                  break
                }
              }
            }
            if (pageName) {
              next({ name: pageName })
            } else {
              next({ name: 'NotFound' })
            }
          } else {
            next({ name: 'NotFound' })
          }
        }
      }
    } else {
      // 没有登录
      next({ name: 'Login' })
    }
  } else {
    // 登录页面，验证是否登录,登录状态不允许跳转login
    if (store.state.userInfo) {
      next({ name: 'Layout' })
    } else {
      next()
    }
  }
})

export default router
