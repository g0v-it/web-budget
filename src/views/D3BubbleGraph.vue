<template>
<div class="container fluid">
  
    <div class="partition-buttons">
        <v-btn-toggle v-model="viewID" mandatory>
            <v-btn flat color="primary" value="default">
                dafault
            </v-btn>
            <v-btn flat color="primary" value="missione">
                per missione
            </v-btn>
        </v-btn-toggle>
    </div>
    <BubbleGraphLegend v-if="viewID=='default'" class="legend-layout" />
    <BudgetBubbles class="graph-layout" @myevent="handle" :partitionID="viewID" />
     
</div>
</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";
import BubbleGraphLegend from "@/components/BubbleGraphLegend.vue";

export default {
  components: {
    BudgetBubbles,
    BubbleGraphLegend
  },

  data: () => {
    return {
      viewID: "default"
    };
  },
  methods: {
    handle(d) {
      console.log(d);
    }
  }
};
</script>

<style>
.container {
  display: grid;
  grid-template-areas:
    "head head head head head"
    "legend graph graph graph graph" ;
  grid-template-rows: 3rem auto;
  height: 100%;
}
.partition-buttons {
  grid-area: head;
  height: 36px;
}
.graph-layout {
  grid-area: graph;
}
.filters-layout {
  grid-area: filters;
}

.container > .graph-layout {
  width: 100%;
  height: 100%;
}
</style>
