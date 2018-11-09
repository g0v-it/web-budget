<template>
  <div class="g0v-container">
    <v-card class="details">
      <h2>{{ currentNode.name }}
        <a
          target="_blank"
          :href="currentNode.account"
          alt="Visualizza i linked data"
          title="Visualizza i linked-data"
        >
          <img :src="logo_rdf" class="g0v-rdf-logo">
        </a>
      </h2>
      <p class="top">Ministero: {{ currentNode.top_level }}</p>
      <p v-if="download_completed" class="second">Missione: {{ currentNode.partitions.second_partition }}</p>
      <p class="description">{{ currentNode.description | capitalize }}</p>
      <div class="numbers">
        <p class="amount"><amount :amount="currentNode.amount" /></p>
        <div class="rate">
          <small>Variazione rispetto alla legge di bilancio {{ +meta.year - 1 }}
            <span v-if="!variation_available">non disponibile.</span>
          </small>
          <div v-if="variation_available" class="diff" :style="{backgroundColor:currentNode.bgColor}">
            <h3><rate :rate="currentNode.diff" /></h3>
          </div>
        </div>
      </div>
    </v-card>
    <v-card class=" history">
      <h2>Storico dell'azione</h2>
      <HistoryChart
        v-if="download_completed && meta_initialized" :values="history"
        :dataset-meta="meta"
        style=""
      />
    </v-card>
    <v-card class="partition">
      <h2>Dettaglio capitoli di spesa</h2>
      <CdsChart
        v-if="download_completed" :values="{lower_partition:currentNode.cds,sum:currentNode.amount}"
        style=""
      />
    </v-card>
    <v-card class="comments">
      <TweetsWall />
    </v-card>
  </div>

</template>

<script>
import HistoryChart from "@/components/HistoryChart.vue";
import CdsChart from "@/components/CdsChart.vue";
import TweetsWall from "@/components/TweetsWall.vue";
import { fillColor } from "@/utils/functions.js";

export default {
  components: {
    HistoryChart,
    CdsChart,
    TweetsWall
  },
  props: {
    code: String
  },
  data() {
    return {
      currentNode: {},
      download_completed: false,
      meta_initialized: false,
    };
  },
  mounted() {
    this.budgetStore()
      .selectNode(this.code)
      .then(res => {
        this.currentNode = res.data;
        this.currentNode.diff =
          (this.currentNode.amount - this.currentNode.last_amount) /
          this.currentNode.last_amount;
        this.currentNode.bgColor = fillColor(this.currentNode.diff);
        this.download_completed = true;
      });
    this.meta_initialized = this.budgetStore().initialized;
  },
  beforeUpdate() {
    this.meta_initialized = this.budgetStore().initialized;
  },
  computed: {
    logo_rdf() {
      return require("@/assets/rdf_flyer.svg");
    },
    variation_available() {
      return isFinite(this.currentNode.diff);
    },
    node: function() {
      return this.$root.$data.budget.state.selectedNode;
    },
    history: function() {
      if (this.download_completed) {
        var history = this.currentNode.past_values;
        history["current"] = this.currentNode.amount;
        return history;
      }
    },
    /*retrive data from root component*/
    meta: function() {
      return this.$root.$data.budget.state.meta;
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
.g0v-container {
  margin: 2em 3em;
  padding: 0;
  display: grid;
  grid-template:
    "info bar" 50%
    "cake social" 50%/1fr 1fr;
  grid-gap: 2em;
}
.g0v-rdf-logo {
  height: 20px;
  vertical-align: middle;
}

h2 {
  font-weight: 500;
  margin-bottom: 1em;
}

.details {
  padding: 1em 2em;
  display: flex;
  flex-direction: column;
}

.details .top,
.details .second {
  margin: 0;
  font-size: 1.2em;
  color: #777777;
}

.details .description {
  font-size: 1.2em;
  margin-top: 2em;
  max-height: 15rem;
  overflow: auto;
}

.details .numbers {
  margin-top: auto;

  font-size: 1.6em;
  font-weight: 600;
  color: #555555;
}

.history {
  padding: 1em 2em;
}
.partition {
  padding: 1em 2em;
}
.comments {
  padding: 1em 2em;
}

.numbers {
  padding-left: 1rem;
  padding-right: 1rem;
}

.numbers h3 {
  vertical-align: middle;
  font-size: 0.9em;
}
.numbers .amount {
  background-color: #fff;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
.numbers .diff {
  display: inline-grid;
  width: 8rem;
  color: #fff;
  padding: 0.5rem;
  margin: 0.5rem;

  text-align: center;
  border-radius: 28px;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

@media screen and (max-width: 900px) {
  small {
    font-size: 20px;
  }
  .g0v-container {
    margin: 0.5em 0.5em;
    grid-template:
      "info"
      "bar"
      "cake"
      "social" 100% / 1fr;
  }
  .details .numbers {
    text-align: center;
  }
  .history {
    padding: 0.5em 0.5em;
  }
  .partition {
    padding: 0.5em 0.5em;
  }
  .comments {
    padding: 0.5em 0.5em;
  }
}
</style>
