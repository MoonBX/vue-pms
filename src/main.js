// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
window._ = require('lodash');

import Vue from 'vue'
import App from './App'
import router from './router'

import 'vue-beauty/package/style/vue-beauty.min.css'
// import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'

import * as filters from './util/filter'
Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) //注册过滤器

import vueBeauty from 'vue-beauty'
import CxltToastr from 'cxlt-vue2-toastr'

Vue.use(vueBeauty);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
