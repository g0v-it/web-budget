<template>
  <div class="g0v-container">
    <div class="g0v-partitions-header">
      <v-btn-toggle v-model="budget.selectedPartition" mandatory>
        <v-btn
          flat color="primary"
          value="default"
          @click="onPartitionChange('default')"
        >
          {{string['$GLOBAL_NAME']}}
        </v-btn>
        <v-btn
          flat color="primary"
          value="top_partition"
          @click="onPartitionChange('top_partition')"
        >
          {{string['$TOP_PARTITION']}}
        </v-btn>
        <v-btn
          flat color="primary"
          value="second_partition"
          @click="onPartitionChange('second_partition')"
        >
          {{string['$SECOND_PARTITION']}}
        </v-btn>
      </v-btn-toggle>
    </div>

    <div ref="container" class="g0v-content">
      <div v-if="budget.selectedPartition=='default'" class="g0v-content-grid">

        <div v-responsive.lg.xl class="left-column ">
          <BubbleChartInfo :dataset-meta="budget.meta" :tot-amount="totAmount" />
        </div>

        <div v-responsive.md.lg.xl class="right-column">
          <v-select
            class="select-ministero" @change="onFiltersChange"
            :items="top_partitions" v-model="budget.filters.top_partition"
            :label="string['$TOP_PARTITION_FILTER_TEXT']" multiple
            clearable deletable-chips
            chips :hint="string['$TOP_PARTITION_FILTER_HINT']"
            persistent-hint
          />
          <v-select
            class="select-missione" @change="onFiltersChange"
            :items="second_partitions" v-model="budget.filters.second_partition"
            :label="string['$SECOND_PARTITION_FILTER_TEXT']" block
            multiple clearable
            deletable-chips chips
            :hint="string['$SECOND_PARTITION_FILTER_HINT']" persistent-hint
          />
          <BubbleChartLegend :dataset-meta="budget.meta" class="g0v-legend" />
        </div>
      </div>

      <div class="g0v-bubble-chart">
        <div v-responsive.md.sm.xs>
          <h2 class="title">{{string['$MAIN_TITLE']}} {{ budget.meta.year }}
            <a target="_blank" :href="budget.meta.source">
              <img :src="logo_rdf" class="g0v-rdf-logo">
            </a>
          </h2>
          <p>{{string['$INFO_TOTAL_LABEL']}}<b> <amount :amount="totAmount.amount" /></b></p>
        </div>
        <BudgetBubbles
          @click="onClick" @over="onMouseOver"
          @out="onMouseOut"
          :partition-id="budget.selectedPartition" :partition-labels="budget.partitionLabels"
          :accounts="budget.accounts" :filters="budget.filters"
        />
        <div v-responsive.sm.xs />
      </div>


      <TooltipBubble
        class="tooltip"
        :style="{ top: hoveredNode.y + 'px' , left: hoveredNode.x + 'px' }"
        :current-node="hoveredNode" :bg-color="hoveredNode.colorBg"
        v-if="showTooltip" @mounted="calcTooltipPos"
      />



    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import BudgetBubbles from "@/components/BudgetBubbles.vue";
import TooltipBubble from "@/components/TooltipBubble.vue";
import BubbleChartInfo from "@/components/BubbleChartInfo.vue";
import BubbleChartLegend from "@/components/BubbleChartLegend.vue";
import * as BudgetStore from "@/budgetStore.js";
import fileString from '@/assets/string.js'

import { debounce } from "lodash";

let readPartitionLabels = null;

export default {
  name: "BubbleView",
  props: {
    urlPartitionID: {
      type: String,
      default: "default"
    }
  },

  components: {
    BudgetBubbles,
    TooltipBubble,
    BubbleChartInfo,
    BubbleChartLegend
  },

  data: function() {
    return {
      string:fileString,
      dialog: false,
      hoveredNode: {},
      showTooltip: false
    };
  },

  computed: {
    logo_rdf() {
      return require("@/assets/rdf_flyer.svg");
    },
    /*retrive data from root component*/
    budget: function() {
      return this.$root.$data.budgetState;
    },
    /* parametro corrispondente alla somma degli amount delle bolle*/
    totAmount: function() {
      let amount = 0;
      let filteredAmount = 0;
      if (this.budget.partitionLabels.top_partition) {
        this.budget.partitionLabels.top_partition.map(i => {
          filteredAmount += parseFloat(i.filteredAmount);
          amount += parseFloat(i.amount);
        });
      }
      return { amount, filteredAmount };
    },
    /*genera array di stringhe per popolare lista filtri top partition*/
    top_partitions() {
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
    /*genera array di stringhe per popolare lista filtri second partition*/
    second_partitions() {
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

  async beforeRouteEnter(to, from, next) {
    if (
      BudgetStore.state.accounts.length === 0 &&
      Object.keys(BudgetStore.state.partitionLabels).length === 0
    ) {
      await Promise.all([
        BudgetStore.actions.readAccounts(),
        BudgetStore.actions.readPartitionLabels()
      ]);
    } else if (Object.keys(BudgetStore.state.partitionLabels).length === 0) {
      await BudgetStore.actions.readPartitionLabels();
    }
    next();
  },

  created() {
    /* Init filters from url params */
    this.budget.filters.top_partition = [];
    this.budget.filters.second_partition = [];
    if (Array.isArray(this.$route.query.top_partition)) {
      this.budget.filters.top_partition = this.$route.query.top_partition;
    } else if (this.$route.query.top_partition) {
      this.budget.filters.top_partition.push(this.$route.query.top_partition);
    }

    if (Array.isArray(this.$route.query.second_partition)) {
      this.budget.filters.second_partition = this.$route.query.second_partition;
    } else if (this.$route.query.second_partition) {
      this.budget.filters.second_partition.push(
        this.$route.query.second_partition
      );
    }

    BudgetStore.actions.readFilteredTots();

    /* set partition to show */
    BudgetStore.actions.selectPartition(this.urlPartitionID);

    readPartitionLabels = debounce(BudgetStore.actions.readFilteredTots, 1000);
  },

  methods: {
    onClick(node) {
      this.$router.push({ name: "account-details", params: { code: node.id } });
    },
    onMouseOver(node) {
      let n = {
        ...node,
        percentageOfTheTotalAmount: node.amount / this.totAmount.amount,
        percentageOfTheTopParition:
          node.amount /
          this.budget.filteredTot.top_partition_label[
            node.partitions.top_partition
          ],
        percentageOfTheSecondParition:
          node.amount /
          this.budget.filteredTot.second_partition_label[
            node.partitions.second_partition
          ],
        colorBg: node.colorBg,
        x: node.x + node.radius / 1.4142,
        y: node.y + node.radius / 1.4142
      };
      this.hoveredNode = n;
      this.showTooltip = true;
    },
    calcTooltipPos({ width, height }) {
      let container = this.$refs.container;
      let newX = this.hoveredNode.x;
      let newY = this.hoveredNode.y;
      if (newY + height >= container.offsetHeight) {
        newY = container.offsetHeight - height;
      }
      if (newX + width >= container.offsetWidth) {
        newX = container.offsetWidth - width;
      }
      this.hoveredNode.x = newX;
      this.hoveredNode.y = newY;
    },
    onMouseOut() {
      this.showTooltip = false;
    },
    onPartitionChange(partitionId) {
      if (partitionId === "default") {
        this.$router.push({
          name: "d3-bubble-graph",
          query: { ...this.budget.filters }
        });
      } else {
        this.$router.push({
          name: "accounts-partition",
          params: { urlPartitionID: partitionId },
          query: { ...this.budget.filters }
        });
      }
    },
    onFiltersChange() {
      this.$router.replace({
        name: "d3-bubble-graph",
        query: { ...this.budget.filters }
      });
      readPartitionLabels();
    }
  }
};
</script>

<style scoped>
.g0v-container {
  padding: 24px 24px 0 24px;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.g0v-content {
  margin: 1rem 0 0 0;
  position: relative;
  height: 100%;
  width: 100%;
}

.g0v-bubble-chart {
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.g0v-rdf-logo {
  height: 20px;
  vertical-align: middle;
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
  width: 100%;
  position: absolute;
  display: grid;
  grid-template-areas: "left . . right";
  grid-auto-columns: 1fr;
  pointer-events: all;
}
@media (max-width: 1000px) {
  .g0v-content-grid {
    grid-template-areas: ". . right";
  }
}

@media (max-width: 400px) {
  .g0v-container {
    padding: 12px 12px 0 12px;
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
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

.select-ministero,
.select-missione {
  margin-bottom: 3rem;
}

.g0v-legend {
  position: absolute;
  width: 100%;
  bottom: 2rem;
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
