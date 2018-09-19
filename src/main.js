import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";

import Rate from "./components/base/Rate.vue";
import Amount from "./components/base/Amount.vue";

import * as api from "./api.service.js";

Vue.config.productionTip = false;

Vue.component("rate", Rate);
Vue.component("amount", Amount);

new Vue({
  data: {
    budget: api.BudgetData()
  },
  router,
  render: h => h(App)
}).$mount("#app");
