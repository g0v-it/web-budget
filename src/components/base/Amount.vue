<template>
    <span>
        {{normalize}}
    </span>
</template>

<script>
export default {
  name: "amount",
  props: {
    amount: {
      type: Number,
      default: "N/A"
    },
    maximumSignificantDigits: {
      type: Number,
      default: 3
    }
  },
  computed: {
    normalize() {
      if (isFinite(this.amount)) {
        return this.amount.toLocaleString("it-IT", {
          style: "currency",
          currency: "EUR",
          maximumSignificantDigits: this.maximumSignificantDigits
        });
      }
      return "N/A";
    }
  }
};
</script>
