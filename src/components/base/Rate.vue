<template>
  <span>
    {{ normalize }}
  </span>
</template>

<script>
import numeralInit from "@/utils/numeralCustomizations";
import Configuration from "@/utils/configuration";
import * as BudgetStore from "@/budgetStore.js";
let numeral;
export default {
  name: "Rate",
  props: {
    rate: {
      type: Number,
      default: Infinity
    },
    format: {
      type: String,
      default: Configuration.current().rateFormat
    }
  },
  created() {
    numeral = numeralInit(BudgetStore.state.meta.um);
  },
  computed: {
    normalize() {
      if (isFinite(this.rate)) {
        return numeral(this.rate).format(this.format);
      }
      return "N/A";
    }
  }
};
</script>
