<template>
  <div class="container">
    <div v-for="account in accounts.slice(0, visibleAccounts)" :key="account.code">
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

import AccountItem from "@/components/AccountListItem.vue";

export default {
  components: {
    AccountItem
  },
  data() {
    return {
      accounts: [],
      visibleAccounts: 5,
      minAmount: 0,
      maxAmount: 0
    };
  },
  computed: {
    budget: function() {
      return this.$root.$data.budget.state;
    }
  },
  methods: {
    initD3: function() {
      this.minAmount = min(this.accounts, d => {
        return +d.amount;
      });
      this.maxAmount = max(this.accounts, d => {
        return +d.amount;
      });
      this.radiusScale = scalePow()
        .exponent(0.5)
        .range([3, 90])
        .domain([this.minAmount, this.maxAmount]);
    },
    radiusScale: Function
  },
  mounted() {
    if (!this.budget.accounts.length) {
      this.$root.$data.budget.readAccounts().then(res => {
        this.accounts = res.data.accounts;
        this.initD3();
      });
    } else {
      this.accounts = this.budget.accounts;
      this.initD3();
    }
  }
};
</script>
