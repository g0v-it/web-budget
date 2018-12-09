<template>
  <div ref="tooltip" class="bubble-tooltip card">
    <VCardTitle class=" tooltipTitle headline grey lighten-2" primary-title>
      <p>{{ currentNode.subject }}</p>
    </VCardTitle>
    <VCardText class="tooltipText">
      <h3>{{ currentNode.title }}</h3>
      <!--p>{{string['$TOOLTIP_PERCENTAGE']}}</p>
      <ul>
        <li v-for="(p,index) in currentNode.percentages" :key="index">
          {{p.string}}{{p.part?string['$TOOLTIP_PERCENTAGE_MEANING']:string['$TOOLTIP_TOTAL_MEANING']}}<b><rate :rate="p.value" /></b></li>
      </ul-->
    </VCardText>
    <div class="numberContainer">
      <div class="amount">
        <h3><Amount :amount="currentNode.amount" /></h3>
      </div>
      <div
        v-if="variation_available" class="diff"
        :style="{background:bgColor }"
      >
        <h3><Rate :rate="currentNode.diff" /></h3>
      </div>
    </div>
  </div>
</template>
<script>
import Configuration from "@/utils/configuration";

export default {
  data() {
    return {
      string: Configuration.current().strings
    };
  },
  props: {
    currentNode: Object,
    bgColor: String
  },
  computed: {
    variation_available() {
      return isFinite(this.currentNode.diff);
    }
  },
  mounted() {
    this.$emit("mounted", {
      width: this.$refs.tooltip.offsetWidth,
      height: this.$refs.tooltip.offsetHeight
    });
  }
};
</script>
<style>
.bubble-tooltip {
  width: 25rem;
  min-height: 15rem;

  /*  z-index: 20; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.tooltipTitle {
  padding: 0;
  text-align: center;
}

.tooltipTitle p {
  width: 100%;
  font-size: 13px;
  margin: 0px;
}

.tooltipText {
  padding: 1em;
}

.tooltipText h3 {
  margin: 0 0 1em 0;
  font-weight: 500;
}
.tooltipText p {
  margin: 0rem;
}
.numberContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
  padding-left: 1rem;
  padding-right: 1rem;
}

.numberContainer h3 {
  display: table-cell;
  vertical-align: middle;
}
.numberContainer .amount {
  background-color: #fff;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
.numberContainer .diff {
  width: 8rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 28px;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.diff h3 {
  background: inherit;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  width: 8rem;
  text-align: center;
  filter: invert(1) grayscale(1) contrast(9);
}
/* .numberContainer .diff h3 {

} */
</style>
