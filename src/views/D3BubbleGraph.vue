<template>
<v-container class="container" fluid="true">
  
        <v-layout row >
            <v-flex lg12 class="py-2">
                <v-btn-toggle v-model="viewID">
                    <v-btn flat color="primary" value="default">
                        globale
                    </v-btn>
                    <v-btn flat color="primary" value="missione">
                        per missione
                    </v-btn>
                </v-btn-toggle>
            </v-flex>
         </v-layout >
 
 
        <v-layout class="graph-layout" wrap>
            <v-flex lg12  class="py-2">
                <!-- <BudgetBubbles v-bind:height="height" v-bind:width="width" :partitionID="viewID" /> -->
                <BudgetBubbles :partitionID="viewID" />
            </v-flex>
        </v-layout >

  </v-container>

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
      viewID: "",
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
.container{
    height: 100%;
}
.btn-group {
  padding: 1rem 2rem;
}
.container > .graph-layout {
  width: 100%;
  height: 100%;
}
</style>
