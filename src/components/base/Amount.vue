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
  name: "Amount",
  props: {
    amount: {
      type: [String, Number],
      default: Infinity
    },
    format: {
      type: String,
      default: Configuration.current().amountFormat
    }
  },
  created() {
    numeral = numeralInit(BudgetStore.state.meta.um);
  },
  computed: {
    normalize() {
      let amt = Number(this.amount);
      if (isFinite(amt)) {
        return numeral(amt).format(this.format);
      }
      return "N/A";
    }
  }
};
</script>
