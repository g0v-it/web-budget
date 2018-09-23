<template>
  <div class="container">
    <!--     <h1 class="title">Accounts list</h1> -->
    <div
      v-for="account in accounts" :key="account.code"
      class="card account-item"
    >
      <div class="bubble">
        <svg width="200" height="200">
          <circle
            :r="radiusScale(account.amount)" :fill="fillColor(rate(account))"
            cx="100" cy="100"
            :stroke="rgb(fillColor(rate(account))).darker()" stroke-width="2"
          />
        </svg>
      </div>
      <h3 class="name">{{ account.name }}</h3>
      <p class="top-partition"> {{ account.partitions.top_partition }}  </p>
      <p class="second-partition">{{ account.partitions.second_partition }}</p>
      <p class="amount"><amount :amount="account.amount" format="$ 0.0 a" /></p>
      <p class="rate"><rate :rate="rate(account)" /></p>
    </div>

  </div>
</template>

<script>
import { min, max, scalePow, rgb } from "d3";
import { fillColor } from "@/utils/functions.js";
export default {
  data() {
    return {
      accounts: [],
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
    rate: function(account) {
      return (account.amount - account.last_amount) / account.last_amount;
    },
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
    radiusScale: Function,
    fillColor,
    rgb: rgb
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


<style scoped>
.account-item {
  margin: 1em 0;
  padding: 1em 2em;
  display: grid;
  grid-template-areas:
    "svg name name"
    "svg top second"
    "svg amount rate";
  grid-auto-columns: 1fr;
}

.bubble {
  grid-area: svg;
}
.name {
  grid-area: name;
}
.top-partition {
  grid-area: top;
}
.second-partition {
  grid-area: second;
}
.amount {
  grid-area: amount;
}
.rate {
  grid-area: rate;
}

.card {
  border-radius: 2px;
  min-width: 0;
  text-decoration: none;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
}
</style>
