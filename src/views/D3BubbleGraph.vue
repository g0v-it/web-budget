<template>
  <div class="g0v-container">
    <div class="g0v-partitions-header">
      <VBtnToggle v-model="budget.selectedPartition" mandatory>
        <VBtn
          v-for="(b,index) in budget.partitionButtons" :key="index"
          flat color="primary"
          :value="b.value"
          @click="onPartitionChange(b.value)"
        >
          {{ b.title }}
        </VBtn>
      </VBtnToggle>
    </div>

    <div ref="container" class="g0v-content">
      <div v-if="budget.selectedPartition=='default'" class="g0v-content-grid">
        <div v-responsive.lg.xl class="left-column ">
          <BubbleChartInfo :dataset-meta="budget.meta" :tot-amount="totAmount" />
        </div>

        <div v-responsive.md.lg.xl class="right-column">
          <VSelect
            v-for="(s,index) in budget.filterSelect" :key="index"
            :items="s.labels" v-model="s.model"
            @change="onFiltersChange"
            :label="string['$PARTITION_FILTER_TEXT']+' '+s.title" multiple
            clearable deletable-chips
            chips
            persistent-hint
          />
          <BubbleChartLegend :dataset-meta="budget.meta" class="g0v-legend" />
        </div>
      </div>

      <div class="g0v-bubble-chart">
        <div v-responsive.md.sm.xs>
          <h2 class="title">
            {{ string['$MAIN_TITLE'] }} {{ budget.meta.year }}
            <a target="_blank" :href="budget.meta.source">
              <img :src="logo_rdf" class="g0v-rdf-logo">
            </a>
          </h2>
          <p>{{ string['$INFO_TOTAL_LABEL'] }}<b> <Amount :amount="totAmount.amount" /></b></p>
        </div>
        <BudgetBubbles
          @click="onClick" @over="onMouseOver"
          @out="onMouseOut"
          :partition-id="budget.selectedPartition" :partition-labels="budget.partitionLabels"
          :accounts="budget.accounts" :filters="filters"
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
import Configuration from "@/utils/configuration";
import { encodeFilters, decodeFilters } from "@/utils/functions.js";
import { debounce } from "lodash";

const options = {
  level: 3,
  name: "hello-world.txt",
  timestamp: parseInt(Date.now() / 1000, 10)
};

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
      string: Configuration.current().strings,
      dialog: false,
      hoveredNode: {},
      showTooltip: false,
      budget: BudgetStore.state
    };
  },

  computed: {
    logo_rdf() {
      return require("@/assets/rdf_flyer.svg");
    },
    /* parametro corrispondente alla somma degli amount delle bolle*/
    totAmount: function() {
      let amount = 0;
      let filteredAmount = 0;
      let partition_keys = Object.keys(this.budget.partitionLabels);
      if (partition_keys.length > 1) {
        if (this.budget.partitionLabels[partition_keys[1]].partitions) {
          this.budget.partitionLabels[partition_keys[1]].partitions.map(i => {
            filteredAmount += parseFloat(i.filteredAmount);
            amount += parseFloat(i.partitionAmount);
          });
        }
      }
      //console.log(amount);

      return { amount, filteredAmount };
    },
    /*genera array di stringhe per popolare lista filtri */
    partitionsLabels() {
      let partitions_labels = [];
      let partitions_keys = this.budget.partitionLabels.keys;
      for (let i = 0; i < partitions.length; ++i) {
        if (this.budget.partitionLabels[partitions_keys[i]].partitions != 0) {
          let partition_labels = [];
          for (
            let i = 0;
            i <
            this.budget.partitionLabels[partitions_keys[i]].partitions.length;
            i++
          ) {
            const element = this.budget.partitionLabels[partitions_keys[i]]
              .partitions[i]["title"];
            partition_labels.push(element);
          }
          partitions_labels.push({
            partitionSchemaName: partitions_keys[i],
            partitionSchemaLabels: partition_labels
          });
        }
      }
      //console.log(partitions_labels);
      return partitions_labels;
    },

    filters() {
      let filterObj = {};
      for (let i = 0; i < this.budget.filterSelect.length; i++) {
        filterObj[this.budget.filterSelect[i].value] = this.budget.filterSelect[
          i
        ].model;
      }
      //console.log(filterObj);

      return filterObj;
    }
  },
  watch: {
    $route(to, from) {
      BudgetStore.actions.selectPartition(this.urlPartitionID);
    }
  },

  async beforeRouteEnter(to, from, next) {
    if (
      BudgetStore.state.accounts.length === 0 //&&
    ) {
      await Promise.all([BudgetStore.actions.readAccounts()]);
    }
    next();
  },

  created() {
    /* Init filters from url params */
    if (this.$route.query.filters) {
      let filters = decodeFilters(this.$route.query.filters);
      this.budget.filterSelect.map(s => {
        /* console.log("s.value", s.value); */
        s.model = filters[s.value];
      });
    }
    BudgetStore.actions.readFilteredTots(this.filters);
    /* set partition to show */
    BudgetStore.actions.selectPartition(this.urlPartitionID);
    readPartitionLabels = debounce(BudgetStore.actions.readFilteredTots, 1000);
  },

  methods: {
    onClick(node) {
      console.log("click");

      this.$router.push({ name: "account-details", params: { code: node.id } });
    },
    onMouseOver(node) {
      let n = {
        ...node,
        colorBg: node.colorBg,
        x: node.x + node.radius,
        y: node.y + node.radius
      };
      /*let percentage = [];
      let keys = Object.keys(this.budget.partitionLabels);
      node.partitionLabel.map(tag => {
        keys.map(k => {
          if (this.budget.partitionLabels[k].partitions != 0) {
            let obj = {};
            obj["part"] = true;
            obj["string"] = this.budget.partitionLabels[k].title;
            let element = this.budget.partitionLabels[k].partitions.find(el => {
              return el.label == tag;
            });
            if (element) {
              obj["value"] = node.amount / element.partitionAmount;
              percentage.push(obj);
            }
          }
        });
      });
      percentage.push({
        part: false,
        value: node.amount / this.totAmount.amount
      });
      n["percentages"] = percentage;*/
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
          query: { filters: encodeFilters(this.filters) }
        });
      } else {
        this.$router.push({
          name: "accounts-partition",
          params: { urlPartitionID: partitionId },
          query: { filters: encodeFilters(this.filters) }
        });
      }
    },
    onFiltersChange() {
      this.$router.replace({
        name: "d3-bubble-graph",
        query: { filters: encodeFilters(this.filters) }
      });
      readPartitionLabels(this.filters);
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
