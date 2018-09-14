<template>
  <div class="g0v-container">
    <div class="g0v-partitions-header">
      <v-btn-toggle v-model="budget.selectedPartition" mandatory>
        <v-btn
          flat color="primary"
          value="default" @click="$router.push({ name: 'd3-bubble-graph',query: budget.filters})"
        >
          default
        </v-btn>
        <v-btn
          flat color="primary"
          value="top_partition" @click="$router.push({ name: 'accounts-partition', params: { urlPartitionID: 'top_partition' },query: budget.filters})"
        >
          ministero
        </v-btn>
        <v-btn
          flat color="primary"
          value="second_partition" @click="$router.push({ name: 'accounts-partition', params: { urlPartitionID: 'second_partition' },query: budget.filters})"
        >
          missione
        </v-btn>
      </v-btn-toggle>
    </div>

    <div class="g0v-content">
      <div v-if="budget.selectedPartition=='default'" class="g0v-content-grid">

        <div class="left-column">
          <BubbleGraphLegend :dataset-meta="budget.meta" :tot-amount="totAmount" />
        </div>

        <div class="right-column">
          <v-select
            class="select-ministero" @change="onFiltersChange"
            :items="top_partitions" v-model="budget.filters.top_partition"
            label="Filtra per Ministero" multiple
            clearable deletable-chips
            chips hint="Scegli i ministeri a cui sei interessato"
            persistent-hint
          />
          <v-select
            class="select-missione" @change="onFiltersChange"
            :items="second_partitions" v-model="budget.filters.second_partition"
            label="Filtra per Missione" block
            multiple clearable
            deletable-chips chips
            hint="Scegli le missioni a cui sei interessato" persistent-hint
          />
        </div>

      </div>

      <div class="g0v-bubble-chart">
        <BudgetBubbles
          v-if="budget.accounts.length"
          @click="onClick" @over="onMouseOver"
          @out="onMouseOut"
          :partition-id="budget.selectedPartition" :partition-labels="budget.partitionLabels"
          :accounts="budget.accounts" :filters="budget.filters"
        />
      </div>

      <TooltipBubble
        class="tooltip" :style="{ top: hoveredNode.y + 'px' , left: hoveredNode.x + 'px' }"
        :current-node="hoveredNode" :bg-color="hoveredNode.colorBg"
        v-if="showTooltip && !dialog"
      />

    </div>

    <v-dialog
      v-model="dialog" fullscreen
      hide-overlay transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn
            icon dark
            @click.native="dialog = false; $router.push({ name: 'd3-bubble-graph',query: budget.filters})"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Dettagli azione</v-toolbar-title>
          <v-spacer />
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
        <DetailBubble :selected-node="budget.selectedNode" />

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
import { debounce } from "lodash";

let readPartitionLabels = null;

export default {
  props: {
    code: {
      type: String,
      default: ""
    },
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
      showTooltip: false,
      dialog: false
    };
  },

  computed: {
    budget: function() {
      return this.$root.$data.budget.state;
    },
    totAmount: function() {
      let tot = 0;
      if (this.budget.partitionLabels.top_partition) {
        this.budget.partitionLabels.top_partition.map(i => {
          tot += parseFloat(i.filteredAmount);
        });
      }
      return tot;
    },
    /* funzione temporanea, bisogna cambiare il json dell'api */
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
    /* come ministeri prima */
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

  created() {
    /* Init dialog from url params */
    if (this.code) {
      this.dialog = true;
      this.budgetStore().selectNode(this.code);
    } else {
      this.dialog = false;
    }

    /* Init filters from url params */
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

    this.budgetStore().initData();
    /* init partition form url params */
    this.budgetStore().selectPartition(this.urlPartitionID);
  },

  mounted() {
    readPartitionLabels = debounce(
      this.budgetStore().readPartitionLabels,
      2000
    );
  },

  watch: {
    $route(to) {
      if (to.name === "d3-bubble-graph") {
        this.budgetStore().selectPartition("default");
        this.dialog = false;
      }
      if (to.name === "account-details") {
        this.budgetStore().selectNode(to.params.code);
        this.dialog = true;
      }
      if (to.name === "accounts-partition") {
        this.budgetStore().selectPartition(to.params.urlPartitionID);
        this.dialog = false;
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
      let n = {
        ...node.d,
        colorBg: node.colorBg,
        x: node.x + node.d.radius / 1.4142,
        y: node.y + node.d.radius / 1.4142
      };
      this.hoveredNode = n;
      this.showTooltip = true;
    },
    onMouseOut() {
      this.showTooltip = false;
    },
    onFiltersChange() {
      this.$router.replace({
        name: "d3-bubble-graph",
        query: this.budget.filters
      });
      readPartitionLabels();
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
