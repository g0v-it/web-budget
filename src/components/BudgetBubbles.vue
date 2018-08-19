<template>
    <div>
      <div id="vis" v-bind:style="{ height: 100 + '%', width: 100 + '%' }"></div>
    </div>
</template>


<script>
import BubbleGraphController from "@/controllers/BubbleGraphController.js";
import rawData from "@/assets/example.json.js";

export default {
  props: {
    height: Number,
    width: Number
  },
  mounted: () => {
      //TODO: classe BubbleGraphController da migliorare
    let graphController = new BubbleGraphController("#vis");
    graphController.setBoundaries(window.innerWidth, window.innerHeight);
    graphController.createNodes(rawData.accounts);
    graphController.startSimulation();
  }
};
</script>

<style>
</style>
