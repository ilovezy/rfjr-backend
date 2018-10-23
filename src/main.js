import Vue from 'vue'
import VCharts from 'v-charts'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters
import CcComponent from './components/CcComponent'

import './global/CONFIG'
import './global/Function'
import './global/Validate'
import './global/Platform'
import './global/ENUM'
import './global/FormValitate'
import Mixin from './global/Mixin'
import USER from './global/USER'
import axios from './global/Fetch'
import _ from 'underscore'
import moment from 'moment'
import $ from 'jquery'

window.USER = USER
window._ = _
window.moment = moment
window.$ = $
window.CurrentEnv = process.env.NODE_ENV
window.isDev = window.CurrentEnv == 'development'

Vue.use(Element, {
  size: 'large', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(CcComponent)
Vue.use(VCharts) // TODO 暂时用不上

Vue.prototype.AXIOS = axios
window.AXIOS = axios

Vue.filter('formatPhone', formatPhone)
Vue.filter('formatThousands', formatThousands)
Vue.filter('formatDate', formatDate)
Vue.mixin(Mixin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = true

import fhcPermission from './global/Permission'

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  created() {
    Vue.directive('permission', fhcPermission) // TODO test权限
  },
  render: h => h(App)
})
