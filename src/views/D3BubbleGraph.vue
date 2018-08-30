<template>
    <div class="container fluid">

        <div class="partition-buttons">
            <v-btn-toggle v-model="partitionID" mandatory>
                <v-btn flat color="primary" value="default">
                    default
                </v-btn>
                <v-btn flat color="primary" value="top_partition">
                    ministero
                </v-btn>
                <v-btn flat color="primary" value="second_partition">
                    missione
                </v-btn>
            </v-btn-toggle>
        </div>

        <BubbleGraphLegend v-if="partitionID=='default'" :datasetMeta="datasetMeta" />
        <BudgetBubbles class="graph-layout" @click="onClick" @over="onMouseOver" @out="onMouseOut" :partitionID="partitionID" :partitionLabels="partitionLabels" />
        <TooltipBubble style="top: 7rem ; right: 2rem; position:fixed;" :currentNode="hoveredNode" :diff="hoveredNode.diff" :bgColor="hoveredNode.colorBg" v-if="showTooltip && !dialog" />

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
                        <v-btn dark flat @click="copyLink">
                            <v-icon>file_copy</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <DetailBubble :selectedNode="selectedNode"></DetailBubble>
            </v-card>
        </v-dialog>

        <footer>
            <ul class="footer">
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
body {
  background: #fafafa;
}
.container {
  height: 100%;
}
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

.container .graph-layout {
  width: 100%;
  height: 100%;
}

footer {
  width: 100;
  padding: 1rem;
}

.footer {
  background: #fafafa;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
}
.footer img {
  border-width: 0;
}

.footer a {
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  text-decoration: none;
}
</style>
