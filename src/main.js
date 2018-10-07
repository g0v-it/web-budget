import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";

import Rate from "./components/base/Rate.vue";
import Amount from "./components/base/Amount.vue";

import * as api from "./api.service.js";

import SocialSharing from "./utils/socialSharing.js";
import SocialSharingNetwork from "./utils/socialSharingNetwork.js";

Vue.config.productionTip = false;

Vue.component("rate", Rate);
Vue.component("amount", Amount);
Vue.component("social-sharing", SocialSharing);
Vue.component("network", SocialSharingNetwork);

Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

const budgetData = api.BudgetData();

var vm = new Vue({
  data: {
    budget: budgetData
  },
  router,
  render: h => h(App)
}).$mount("#app");

vm.budget.initData();
