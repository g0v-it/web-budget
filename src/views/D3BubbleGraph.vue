<template>
  <div>
    <div class="btn-group">
      <button class="btn">default</button>
      <button class="btn">group1</button>
      <button class="btn">group2</button>
    </div>
    <div class="graph-container">
      <BudgetBubbles v-bind:height="height" v-bind:width="width" />
    </div>  
  </div>
</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";


export default {
  name: "d3-bubble-graph",
  components: {
    BudgetBubbles
  },

  data: () => {
    return {
      height: 0,
      width: 0
    };
  },

  methods: {},

  created: function() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }
};
</script>

<style>
.btn-group {
  padding: 1rem 2rem;
}
.graph-container {
  width: 100%;
  height: 100%;
}
</style>
