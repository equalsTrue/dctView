import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {getToken} from '@/utils/auth' // getToken from cookie
// import Layout from './views/layout/Layout'
// import { AppMain } from '@/views/layout/components'
const AppMain = () => import('@/views/layout/components/AppMain')
const Layout = () => import('@/views/layout/Layout')
const errorPage = () => import('./views/errorPage/404.vue')
// const _import = file => () => import('@/views/' + file + '.vue')
// const _import = file => () => ({
//   // 需要加载的组件 (应该是一个 `Promise` 对象)
//   component: import('@/views/' + file + '.vue'),
//   // 异步组件加载时使用的组件
//   loading: Layout,
//   // 加载失败时使用的组件
//   error: errorPage,
//   // 展示加载时组件的延时时间。默认值是 200 (毫秒)
//   delay: 200,
//   // 如果提供了超时时间且组件加载也超时了，
//   // 则使用加载失败时使用的组件。默认值是：`Infinity`
//   timeout: 3000
// })

NProgress.configure({showSpinner: false})// NProgress Configuration

// permissiom judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed di
//   // rectly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }


const whiteList = ['/login', '/workWeChatLogin', '/version', '/401', '/404'] // 免登录白名单

const cachePathList = ['index','creatorIndex','pidIndex']

function initRouterChild(childList, parent) {
  const children = []
  if (childList != null) {
    for (let i = 0; i < childList.length; i++) {
      const child = childList[i]
      if (cachePathList.indexOf(child.path.split('/')[1]) !== -1 || cachePathList.indexOf(child.path) !== -1) {
        child.meta.keepAlive = true
      }
      if (child.leaf) {
        const parentPath = parent.path.replace(/\//, '') + '/'
        const childPath = child.path.replace(/\/:id/, '')
        const impartPath = parentPath + childPath
        try {
          const component = () => import('@/views/' + impartPath.replace(/^\/+/, '') + '.vue')
          child.component = component
          child.redirect = null
          child.meta.operator = child.operator
        } catch (error) {
          console.error(error)
          try {
            const component = () => import('@/views/' + childPath.replace(/^\/+/, '') + '.vue')
            child.component = component
            child.redirect = null
          } catch (e) {
            console.error(error)
            continue
          }
        }
      } else {
        child.meta.keepAlive = true
        child.component = AppMain
        child.path = '/' + child.path
      }
      children.push(child)
      if (child.children) {
        initRouterChild(child.children, child)
      }
    }
  }
  parent.children = children
}

router.beforeEach((to, from, next) => {
  NProgress.start() // 进度条开始
  // console.log(to)
  if (getToken()) { // 判断是否已有token
    /* has token*/
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!(store.getters.sidebars) || store.getters.sidebars.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => {
          const routerDatas = res.data.routers
          const myRouterMap = []
          for (let i = 0; i < routerDatas.length; i++) {
            const myRouter = routerDatas[i]
            myRouter.component = Layout
            initRouterChild(myRouter.children, myRouter)
            if (myRouter.path !== '' && myRouter.path !== null) {
              myRouter.path = '/' + myRouter.path
            }
            myRouterMap.push(myRouter)
          }
          // 拉取user_info
          // const roles = res.data.roles // 注意: 角色必须是一个数组! 例如: ['editor','develop']
          store.dispatch('GenerateRoutes', {myRouterMap}).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters)// 动态添加可访问路由表
            next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            if(err.indexOf("timeout") > -1){
              Message.error('用户token超时，请重新登录！')
            }else {
              Message.error('获取用户信息失败，请重新登录！')
            }
            NProgress.done()
            next({path: '/login'})
          })
        })
      } else {
        // 没有权限的页面根本不会写入路由表，路由表中没有的统统重定向到404
        if (to.matched === null || to.matched.length === 0) {
          const importPath = to.fullPath.replace(/^\/+/, '')
          try {
            // _import(importPath)
            next({path: '/login'})
          } catch (err) {
            try {
              // const fullPathArr = importPath.split('/')
              // _import(importPath.substring(0, importPath.indexOf(fullPathArr[fullPathArr.length - 1]) - 1))
              next({path: '/login'})
            } catch (err) {
              next({path: '/login'})
            }
          }
        } else {
          next()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
