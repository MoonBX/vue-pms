// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
window._ = require('lodash');

import Vue from 'vue'
import App from './App'
import router from './router'
//import axios from 'axios';

import 'vue-beauty/package/style/vue-beauty.min.css'
import 'font-awesome/css/font-awesome.css'

import vueBeauty from 'vue-beauty'
Vue.use(vueBeauty);

//Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
