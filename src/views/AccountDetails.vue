<template>
    <div  class="modal-layout">
      <v-card  class="grid-block details">  
          <v-card-title primary-title>
            <div>
              <div class="headline">{{currentNode.name}}</div>
              <br>
              <div class="grey--text">Ministero: {{currentNode.top_level}}</div>
              <div v-if="download_completed" class="grey--text">Missione: {{currentNode.partitions.second_partition}}</div>
            </div>
          </v-card-title>
        <v-card-text >
              {{currentNode.description}}
             </v-card-text>
            <div class="bottom">
            <div><h2 >Spesa: € {{currentNode.amount}}</h2></div>
            <div><h2 >Ultima spesa: € {{currentNode.last_amount}}</h2></div>
            </div>
      </v-card>
      <v-card  class="grid-block history">
        <v-card-title primary-title>
            <div>
              <div class="headline">Storico dell'azione</div>
            </div>
          </v-card-title>
        <HistoryChart v-if="download_completed"  :values="history" style=""></HistoryChart>
      </v-card>
      <v-card class="grid-block partition">
        <div>
              <div class="headline">Suddivisione in capitoli di spesa</div>
        </div>
        <CdsChart v-if="download_completed" :values="{lower_partition:currentNode.cds,sum:currentNode.amount}" style=""></CdsChart>
      </v-card>
      <v-card class="grid-block comments">
        <h1>Spazio per social</h1>
      </v-card>
    </div>

</template>

<script>
import HistoryChart from "@/components/HistoryChart.vue"
import CdsChart from "@/components/CdsChart.vue"

export default {
  components: {
    HistoryChart,
    CdsChart
  },
  props: {
    code: String
  },
  data(){
      return{
          currentNode:{},
          download_completed:false
      }
  },
  mounted() {
    this.budgetStore().selectNode(this.code).then(res=>{
        this.currentNode=res.data;
        console.log(this.currentNode);
        this.download_completed=true;
    });
  },
  computed: {
    node: function() {
      return this.$root.$data.budget.state.selectedNode;
    },
    history: function(){
      if(this.download_completed){
        var history=this.currentNode.past_values;
        history["current"]=this.currentNode.amount
        return history;
      }
    }
  },
  methods: {
    budgetStore() {
      return this.$root.$data.budget;
    }
  }
};
</script>

<style scoped>

.modal-layout {
  margin: 0;
  padding: 1rem 1rem;
  min-height: 30rem;
  width: 100%;
  /* height: 100vh; */
  text-align: start;
  display: grid;
  /*   grid-gap: 1rem; */
  grid-row-gap: 2rem;
  grid-column-gap: 2rem;
  grid-template-columns: repeat(2, 1fr);
  pointer-events: all;
}
.modal-layout .grid-block {
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  /*   justify-content: space-between; */
}

.history {
  padding: 1rem;
}
.partition {
  padding: 1rem;
}
.comments {
  padding: 1rem;
}


@media screen and (max-width: 700px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
.bottom {
  position: absolute;
  bottom:2rem;
  left:2rem;
}



</style>
