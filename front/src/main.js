// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MainSignage from './MainSignage'
import CardReader from './CardReader'
import Register from './Register'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  {path: '/', component: MainSignage},
  {path: '/register/:id', component: Register},
  {path: '/watchdog', component: App},
  {path: '/cardreader', component: CardReader},
]
const router = new VueRouter({
  mode: 'history',
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  router,
  // components: { App },
  // template: '<App/>'
})
