<template>
  <span>
    {{ normalize }}
  </span>
</template>

<script>
import numeral from "@/utils/numeralCustomizations";
import Configuration from "@/utils/configuration";

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
