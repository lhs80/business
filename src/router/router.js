import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import {
  formatRoutes
} from '@/utils/util'
import Layout from '@/components/index/'
import baseRouter from './_router'
const _import = require('./_import')

Vue.use(VueRouter)

export default new VueRouter({
  // mode: 'history',
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior(to, from, savedPosition) {
  	//设置滚动样式  savedPosition  这个是否调用的是history时
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  //concat链接多个字符或者数字
  routes: [].concat(...formatRoutes(store.state.user.menu), baseRouter)
  
/*  
    //配置动态路由
 	const router = new VueRouter({
	  routes: [
	    // 动态路径参数 以冒号开头
	    { path: '/user/:id', component: User }
	  ]
	})
	const User = {
	  template: '<div>User {{ $route.params.id }}</div>'
	}
	*/
  
  
  
})
