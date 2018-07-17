// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'
import * as api from './api'

//axios低版本兼容Polyfill
require('es6-promise').polyfill()

//300ms问题，PC端请双击输入类控件
FastClick.attach(document.body)

Vue.config.productionTip = false;

Vue.prototype.publicApi = api;
Vue.prototype.$http = axios

import  { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)

import  { AlertPlugin } from 'vux'
Vue.use(AlertPlugin)

import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)

//路由切换显示加载中
// router.beforeEach((to, from, next) => {
//   store.dispatch("globalLoading",true);
//   next()
// })
// router.afterEach((to, from) => {
//   store.dispatch("globalLoading",false);
// })

/* eslint-disable no-new */
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
