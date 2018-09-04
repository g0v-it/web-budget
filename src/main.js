import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import * as api from './api.service.js'

Vue.config.productionTip = false

new Vue({
  data: {
    budget: api.BudgetData()
  },
  router,
  render: h => h(App)
}).$mount('#app')
