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

    <BudgetBubbles class="graph-layout" @click="onClick" @over="onMouseOver" @out="onMouseOut" :partitionID="viewID" />
    <TooltipBubble :style="{ top: currentNode.y + 'px' , left: currentNode.x + 'px' }"
        :topLevel="currentNode.topLevel"
        :title="currentNode.name"
        :amount="currentNode.amount"
        :diff="currentNode.diff"
        :bgColor="currentNode.colorBg"
        :dkColor="currentNode.darkerColor"
        v-if=showTooltip
        ></TooltipBubble>
    <DetailBubble v-if=showDetail @close="closeDialog"></DetailBubble>

</div>
</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";
import TooltipBubble from "@/components/TooltipBubble.vue";
import DetailBubble from "@/components/DetailBubble.vue";
export default {
  components: {
    BudgetBubbles,
    TooltipBubble,
    DetailBubble
  },

  data: () => {
    return {
      viewID: "default",
      currentNode:{},
      showTooltip:false,
      showDetail:false
    };
  },
  methods:{
      onClick(node){
        this.showDetail=true;   
      },
      onMouseOver(node){ 
          let n={};       
        n.topLevel="ECONOMIA E FINANZE" 
        n.name="Realizzazione del sistema integrato delle banche dati in materia tributaria e fiscale" 
        n.amount="€ 3894 bilion"
        n.diff=""+Math.round(node.d.diff * 100) / 100+" %"
        n.colorBg=node.colorBg
        n.darkerColor=node.darkerColor
        n.x=node.x-70;
        n.y=node.y-node.d.radius-119
        this.currentNode=n;
        this.showTooltip=true;  
      },
      onMouseOut(node){
          console.log(node);  
      },
      closeDialog(el){
          console.log(el);
          this.showDetail=false;
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
