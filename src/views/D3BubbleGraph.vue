<template>
<v-container class="container" fluid="true">
  
        <v-layout row >
            <v-flex lg12 class="py-2">
                <v-btn-toggle v-model="viewID" mandatory>
                    <v-btn flat color="primary" value="default">
                        dafault
                    </v-btn>
                    <v-btn flat color="primary" value="missione">
                        per missione
                    </v-btn>
                </v-btn-toggle>
            </v-flex>
         </v-layout >
 
        <v-layout class="graph-layout" wrap>
           
            <v-flex  class="py-2">
                <BudgetBubbles @click="onClick" @over="onMouseOver" @out="onMouseOut" :partitionID="viewID" />
            </v-flex>
           
        </v-layout >

  </v-container>

</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";
import TooltipBubble from "@/components/BudgetBubbles.vue";
import DetailBubble from "@/components/DetailBubbles.vue";
export default {
  components: {
    BudgetBubbles
    
  },

  data: () => {
    return {
      viewID: "default",
    };
  },
  methods:{
      onClick(node){
          console.log(node);   
      },
      onMouseOver(node){
          console.log(node);  
      },
      onMouseOut(node){
          console.log(node);  
      }
  }
};
</script>

<style>
.container{
    height: 100%;
}
.container > .graph-layout {
  width: 100%;
  height: 100%;
}
</style>
