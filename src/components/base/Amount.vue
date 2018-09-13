<template>
    <span>
        {{normalize}}
    </span>
</template>

<script>
import numeral from '@/utils/numeralCustomizations';
import Configuration from '@/utils/configuration'

export default {
  name: "amount",
  props: {
    amount: {
      type: [String, Number],
      default: "N/A"
    },
    format: {
      type: String,
      default: Configuration().current().amountFormat
    }
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
