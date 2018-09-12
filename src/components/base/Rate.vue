<template>
    <span>
        {{normalize}}
    </span>
</template>

<script>
export default {
  name: "rate",
  props: {
    rate: {
      type: Number,
      default: "N/A"
    },
    maximumFractionDigits: {
      type: Number,
      default: 2
    }
  },
  computed: {
    normalize() {
      if (isFinite(this.rate))
        return (
          this.rate.toLocaleString("it-IT", {
            maximumFractionDigits: this.maximumFractionDigits
          }) + "%"
        );
      return "N/A";
    }
  }
};
</script>
