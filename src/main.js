import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import * as api from './api.service.js'
import Configuration from './utils/configuration'

Vue.config.productionTip = false
Vue.prototype.$settings = Configuration();
Vue.prototype.$http = api;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
