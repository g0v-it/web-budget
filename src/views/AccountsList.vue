<template>
  <div class="container">
    <div v-for="account in budget.accounts.slice(0, visibleAccounts)" :key="account.code">
      <AccountItem :account="account" :r="radiusScale(account.amount)" />
    </div>
    <v-btn
      block @click="visibleAccounts += 10"
      style="width:25em; margin: 5em auto 0 auto;"
    >
      Visualizza altri
    </v-btn>
  </div>
</template>

<script>
import { min, max, scalePow } from "d3";
import * as BudgetStore from "@/budgetStore.js";
import AccountItem from "@/components/AccountListItem.vue";

export default {
  components: {
    AccountItem
  },
  data() {
    return {
      visibleAccounts: 5,
      minAmount: 0,
      maxAmount: 0
    };
  },
  computed: {
    budget: function() {
      return this.$root.$data.budgetState;
    }
  },
  created() {
    this.initD3();
  },
  methods: {
    initD3: function() {
      this.minAmount = min(this.budget.accounts, d => {
        return +d.amount;
      });
      this.maxAmount = max(this.budget.accounts, d => {
        return +d.amount;
      });
      this.radiusScale = scalePow()
        .exponent(0.5)
        .range([3, 90])
        .domain([this.minAmount, this.maxAmount]);
    },
    radiusScale: Function
  },
  async beforeRouteEnter(to, from, next) {
    if (BudgetStore.state.accounts.length === 0) {
      await BudgetStore.actions.readAccounts();
    }
    next();
  }
};
</script>
