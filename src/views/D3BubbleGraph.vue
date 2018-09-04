<template>
    <div class="g0v-container">

        <div class="g0v-partitions-header">
            <v-btn-toggle v-model="budget.selectedPartition" mandatory>
                <v-btn flat color="primary" value="default" @click="$router.push({ name: 'd3-bubble-graph'})">
                    default
                </v-btn>
                <v-btn flat color="primary" value="top_partition" @click="$router.push({ name: 'accounts-partition', params: { urlPartitionID: 'top_partition' }})">
                    ministero
                </v-btn>
                <v-btn flat color="primary" value="second_partition" @click="$router.push({ name: 'accounts-partition', params: { urlPartitionID: 'second_partition' }})">
                    missione
                </v-btn>
            </v-btn-toggle>
        </div>

        <div class="g0v-content">

            <div v-if="budget.selectedPartition=='default'" class="g0v-content-grid">

                <div class="left-column">
                    <BubbleGraphLegend :datasetMeta="budget.meta" />
                </div>

                <div class="right-column">
                    <v-select class="select-ministero" :items="ministeri" v-model="filters.ministeri" label="Filtra per Ministero" multiple clearable deletable-chips chips hint="Scegli i ministeri a cui sei interessato" persistent-hint></v-select>
                    <v-select class="select-missione" :items="missioni" v-model="filters.missioni" label="Filtra per Missione" block multiple clearable deletable-chips chips hint="Scegli le missioni a cui sei interessato" persistent-hint></v-select>
                </div>

            </div>
            <!--  -->
            <div class="g0v-bubble-chart">
                <BudgetBubbles class="graph-layout" @click="onClick" @over="onMouseOver" @out="onMouseOut" :filters="filters" :partitionID="budget.selectedPartition" :partitionLabels="budget.partitionLabels" :accounts="budget.accounts" />
            </div>

            <TooltipBubble :style="{ top: hoveredNode.y + 'px' , left: hoveredNode.x + 'px' }" class="tooltip" :currentNode="hoveredNode" :bgColor="hoveredNode.colorBg" v-if="showTooltip && !dialog" />

        </div>

        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click.native="dialog = false; $router.push({ name: 'd3-bubble-graph'})">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Dettagli azione</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat>
                            <v-icon>fab fa-facebook</v-icon>
                        </v-btn>
                        <v-btn dark flat>
                            <v-icon>fab fa-twitter</v-icon>
                        </v-btn>
                        <v-btn dark flat>
                            <v-icon>file_copy</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <DetailBubble v-if="dialog" :selected-node="budget.selectedNode"></DetailBubble>

            </v-card>
        </v-dialog>

    </div>
</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";
import TooltipBubble from "@/components/TooltipBubble.vue";
import DetailBubble from "@/components/DetailBubble.vue";
import BubbleGraphLegend from "@/components/BubbleGraphLegend.vue";

export default {
  props: {
    code: String,
    urlPartitionID: {
      type: String,
      default: "default"
    }
  },

  components: {
    BudgetBubbles,
    TooltipBubble,
    DetailBubble,
    BubbleGraphLegend
  },

  data: function() {
    return {
      hoveredNode: {},
      filters: {
        ministeri: [],
        missioni: []
      },
      showTooltip: false,
      dialog: false
    };
  },

  computed: {
    budget: function() {
      return this.$root.$data.budget.state;
    },
    /* funzione temporanea, bisogna cambiare il json dell'api */
    ministeri() {
      let ministeri = [];
      if (this.budget.partitionLabels["top_partition"]) {
        for (
          let i = 0;
          i < this.budget.partitionLabels["top_partition"].length;
          i++
        ) {
          const element = this.budget.partitionLabels["top_partition"][i][
            "top_partition"
          ];
          ministeri.push(element);
        }
      }
      return ministeri;
    },
    /* come ministeri prima */
    missioni() {
      let missioni = [];
      if (this.budget.partitionLabels["second_partition"]) {
        for (
          let i = 0;
          i < this.budget.partitionLabels["second_partition"].length;
          i++
        ) {
          const element = this.budget.partitionLabels["second_partition"][i][
            "second_partition"
          ];
          missioni.push(element);
        }
      }
      return missioni;
    }
  },

  created() {
    if (this.code) {
      this.dialog = true;
      this.budgetStore().selectNode(this.code);
    } else {
      this.dialog = false;
    }
    this.budgetStore().selectPartition(this.urlPartitionID);
  },

  mounted() {},

  watch: {
    $route(to, from) {
      if (to.name === "d3-bubble-graph") {
        this.dialog = false;
        this.budgetStore().selectPartition("default");
      }
      if (to.name === "account-details") {
        this.budgetStore().selectNode(this.$route.params.code);
        this.dialog = true;
      }
      if (to.name === "accounts-partition") {
        this.dialog = false;
        this.budgetStore().selectPartition(this.$route.params.urlPartitionID);
      }
    }
  },

  methods: {
    onClick(node) {
      this.dialog = true;
      this.showTooltip = false;
      this.$router.push({ name: "account-details", params: { code: node.id } });
    },
    onMouseOver(node) {
      let n = {};
      n.topLevel = node.d.top_level;
      n.name = node.d.name;
      n.amount = `€ ${node.d.amount}`;
      n.diff = "" + Math.round(node.d.diff * 100) / 100 + " %";
      n.colorBg = `${node.colorBg}`;
      n.darkerColor = node.darkerColor;
      n.x = node.x + node.d.radius;
      n.y = node.y + node.d.radius;
      this.hoveredNode = n;
      this.showTooltip = true;
    },
    onMouseOut(node) {
      this.showTooltip = false;
    },
    closeDialog(el) {
      this.dialog = false;
    },
    budgetStore() {
      return this.$root.$data.budget;
    }
  }
};
</script>

<style>
.g0v-container {
  padding: 24px 24px 0 24px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* .g0v-partitions-header{
    height: 3rem;
} */

.g0v-content {
  margin: 1rem 0 0 0;
  position: relative;
  height: 100%;
}

.g0v-bubble-chart {
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.tooltip {
  top: 0;
  left: 0;
  z-index: 1;
  position: absolute;
}

.g0v-content-grid {
  padding: 0;
  margin: 0;
  pointer-events: none;
  height: 100%;
  position: absolute;
  display: grid;
  grid-template-areas: "left . . right";
  grid-auto-columns: 1fr;
  pointer-events: all;
}
@media (max-width: 1000px) {
  .g0v-content-grid {
    grid-template-areas: "left . right";
  }
}

.left-column {
  position: relative;
  grid-area: left;
}

.right-column {
  padding: 5rem 0;
  position: relative;
  grid-area: right;
}

.right-column .select-ministero,
.select-missione {
  margin-bottom: 3rem;
}

/* Global style */
.card {
  border-radius: 2px;
  min-width: 0;
  text-decoration: none;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
}
</style>
