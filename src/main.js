import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import Configuration from "@/utils/configuration";

import Rate from "./components/base/Rate.vue";
import Amount from "./components/base/Amount.vue";

import * as BudgetStore from "./budgetStore.js";

import SocialSharing from "./utils/socialSharing.js";
import SocialSharingNetwork from "./utils/socialSharingNetwork.js";
import responsive from "vue-responsive";

Vue.config.productionTip = false;



Vue.component("Rate", Rate);
Vue.component("Amount", Amount);
Vue.component("SocialSharing", SocialSharing);
Vue.component("Network", SocialSharingNetwork);

Vue.use(responsive);

Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

const configuration = Configuration;

configuration.load().then(() => {
  new Vue({
    data: {
      configurationLoaded: true,
      budgetState: BudgetStore.state
    },
    router,
    methods: {
      ...BudgetStore.actions
    },
    render: h => h(App)
  }).$mount("#app");
});
