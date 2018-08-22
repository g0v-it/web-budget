<template>
    <div class="container fluid">
        <div class="partition-buttons">
            <v-btn-toggle v-model="partitionID" mandatory>
                <v-btn flat color="primary" value="default">
                    dafault
                </v-btn>
                <v-btn flat color="primary" value="missione">
                    per missione
                </v-btn>
            </v-btn-toggle>
        </div>
        <BubbleGraphLegend v-if="partitionID=='default'"/>
        <BudgetBubbles class="graph-layout" @myevent="handle" :partitionID="partitionID"/>
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
      partitionID: "default"
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
  height: 100%;
}


.container > .graph-layout {
  width: 100%;
  height: 100%;
}
</style>
