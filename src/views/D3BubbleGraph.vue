<template>
    <div class="g0v-container">

        <div class="g0v-partitions-header">
            <v-btn-toggle v-model="partitionID" mandatory>
                <v-btn flat color="primary" value="default">
                    dafault
                </v-btn>
                <v-btn flat color="primary" value="top_partition">
                    ministero
                </v-btn>
                <v-btn flat color="primary" value="second_partition">
                    missione
                </v-btn>
            </v-btn-toggle>
        </div>

        <div class="g0v-content">

            <div class="g0v-content-grid">

                <div class="left-column">
                    <BubbleGraphLegend v-if="partitionID=='default'" :datasetMeta="datasetMeta" />
                </div>

                <div class="right-column">
                    <TooltipBubble :currentNode="hoveredNode" :diff="hoveredNode.diff" :bgColor="hoveredNode.colorBg" v-if="showTooltip && !dialog" />
                </div>

            </div>

            <div class="g0v-bubble-chart">
                <BudgetBubbles class="graph-layout" @click="onClick" @over="onMouseOver" @out="onMouseOut" :partitionID="partitionID" :partitionLabels="partitionLabels" />
            </div>

        </div>

        <footer>
            <ul class="g0v-footer">
                <li>
                    <a target="_blank" rel="noopener noreferrer" href="https://git.copernicani.it/g0v/web-budget">Seguici su Gitlab</a>
                </li>
                <li>
                    <a target="_blank" rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                        <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/80x15.png" />
                    </a>
                </li>
            </ul>
        </footer>

    </div>
</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";
import TooltipBubble from "@/components/TooltipBubble.vue";
import DetailBubble from "@/components/DetailBubble.vue";
import BubbleGraphLegend from "@/components/BubbleGraphLegend.vue";

import {
  getAccounts,
  getNodeDetails,
  getPartitionLabels
} from "@/utils/api.service.js";

export default {
  props: {
    code: String
  },
  components: {
    BudgetBubbles,
    TooltipBubble,
    DetailBubble,
    BubbleGraphLegend
  },

  data: () => {
    return {
      hoveredNode: {},
      datasetMeta: {},

      selectedNode: {},
      partitionID: "default",
      partitionLabels: {},
      showTooltip: false,
      dialog: false
    };
  },
  created() {
    if (this.code) {
      this.dialog = true;
      getNodeDetails(this.code).then(res => {
        this.selectedNode = res.data;
      });
    } else {
      this.dialog = false;
    }
  },
  mounted() {
    getAccounts().then(res => {
      this.datasetMeta = res.data.meta;
    });
    getPartitionLabels().then(res => {
      this.partitionLabels = res.data;
    });
  },
  watch: {
    $route(to, from) {
      if (to.name === "d3-bubble-graph") {
        this.dialog = false;
      } else {
        getNodeDetails(this.$route.params.code).then(res => {
          this.selectedNode = res.data;
        });
        this.dialog = true;
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
      n.x = node.x;
      n.y = node.y;
      this.hoveredNode = n;
      this.showTooltip = true;
    },
    onMouseOut(node) {
      this.showTooltip = false;
    },
    closeDialog(el) {
      this.dialog = false;
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
  /*   background: rgba(0, 0, 0, 0.342); */
  height: 100%;
  width: 100%;
}

.g0v-content-grid {
  padding: 0;
  margin: 0;
  pointer-events: none;
  height: 100%;
  position: absolute;
  z-index: 0;
  display: grid;
  grid-template-areas: "left . . . right";
  grid-auto-columns: 1fr;
}

.left-column {
  /*   background: rgba(220, 255, 221, 0.247); */
  position: relative;
  grid-area: left;
}

.right-column {
  /*   background: rgba(220, 244, 255, 0.39); */
  position: relative;
  grid-area: right;
}

footer {
  height: 3rem;
  width: 100;
  padding: 0.5rem 0;
}

.g0v-footer {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
}

.g0v-footer img {
  border-width: 0;
}

.g0v-footer a {
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  text-decoration: none;
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
