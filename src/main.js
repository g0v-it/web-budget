import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import * as api from './api.service.js'

Vue.config.productionTip = false
Vue.prototype.$http = api;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
