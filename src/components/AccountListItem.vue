<template>
  <div class="account-item">
    <div class="bubble">
      <svg width="200" height="200">
        <circle
          :r="r" :fill="fillColor(rate(account))"
          cx="100" cy="100"
          :stroke="rgb(fillColor(rate(account))).darker()" stroke-width="2"
        />
      </svg>
    </div>
    <h2 class="name">
      {{ account.name }} <router-link :to="{name:'account-details', params:{code:account.code}}"><v-icon color="blue">link</v-icon></router-link>
    </h2>
    <p class="top-partition">Ministero: {{ account.partitions.top_partition }}  </p>
    <p class="second-partition">Missione: {{ account.partitions.second_partition }}</p>
    <p class="amount"><amount :amount="account.amount" format="$ 0.0 a" /></p>
    <p class="rate"><rate v-if="account.last_amount!=undefined" :rate="rate(account)" format="+0.0 %" /></p>
    <br v-responsive.sm.xs>
    <br v-responsive.sm.xs>
  </div>
</template>

<script>
import { rgb } from "d3";
import { fillColor } from "@/utils/functions.js";
export default {
  props: {
    account: Object,
    r: Number
  },
  methods: {
    rate: function(account) {
      return (account.amount - account.last_amount) / account.last_amount;
    },
    radiusScale: Function,
    fillColor,
    rgb: rgb
  }
};
</script>


<style scoped>

@media (min-width: 900px) {
  .account-item {
      margin: 1em 0;
  padding: 1em 2em;
  position: relative;
  display: grid;
  grid-gap: 0.5em;
  grid-template-areas:
    "svg name name"
    "svg top second"
    "svg amount rate";
  grid-auto-columns: 1fr 1fr 1fr;
  grid-auto-rows: 2fr 1fr 1fr;
  }
}
@media (max-width: 900px) {
  .account-item {
  margin: 1em 0;
  padding: 1em 2em;
  position: relative;
  }
  .account-item h2 {
    text-align: center;
    margin-top:5rem;
  }
}

.account-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  height: 1px;
  width: 80%;
  margin: auto auto;
  left: 0;
  right: 0;
  background: lightgray;
}

.account-item p {
  margin: 0;
}

.bubble {
  grid-area: svg;
  display: flex;
  justify-content: center;
}
.name {
  font-weight: 500;

  grid-area: name;
}

/* .name a {
  color: black;
  text-decoration: underline solid black;
} */
.top-partition {
  grid-area: top;
  font-size: 1.2em;
  color: #666666;
}
.second-partition {
  grid-area: second;
  font-size: 1.2em;
  color: #666666;
}
.amount {
  grid-area: amount;
  font-size: 1.5em;
  font-weight: 600;
  color: #555555;
}
.rate {
  grid-area: rate;
  font-size: 1.5em;
  font-weight: 600;
  color: #555555;
}
</style>
