<template>
  <div class="g0v-container">
    <v-card class="details">
      <h2>{{ currentNode.name }}
           <a target="_blank"
              :href="currentNode.account"
              alt="Visualizza il linked-data nella Knowledge Base"
              title="Visualizza il linked-data nella Knowledge Base"><v-icon color="blue">link</v-icon></a>
      </h2>
      <p class="top">Ministero: {{ currentNode.top_level }}</p>
      <p v-if="download_completed" class="second">Missione: {{ currentNode.partitions.second_partition }}</p>
      <p class="description">{{ currentNode.description | capitalize }}</p>
      <div class="numbers">
        <p class="amount"><amount :amount="currentNode.amount" /></p>
        <div class="rate"><small>Variazione rispetto al bilancio {{ +meta.year - 1 }}</small>
          <div class="diff" :style="{backgroundColor:currentNode.bgColor}">
            <h3><rate :rate="currentNode.diff" /></h3>
          </div>
        </div>
      </div>
    </v-card>
    <v-card class=" history">
      <h2>Storico dell'azione</h2>
      <HistoryChart
        v-if="download_completed" :values="history" :dataset-meta="meta"
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
    </v-card>
  </div>

</template>

<script>
import HistoryChart from "@/components/HistoryChart.vue";
import CdsChart from "@/components/CdsChart.vue";
import { fillColor } from "@/utils/functions.js";

export default {
  components: {
    HistoryChart,
    CdsChart
  },
  props: {
    code: String
  },
  data() {
    return {
      currentNode: {},
      download_completed: false
    };
  },
  mounted() {
    this.budgetStore()
      .selectNode(this.code)
      .then(res => {
        this.currentNode = res.data;
        this.currentNode.diff = (this.currentNode.amount- this.currentNode.last_amount )/this.currentNode.last_amount;
        this.currentNode.bgColor = fillColor(this.currentNode.diff);

        console.log(this.currentNode);
        this.download_completed = true;
      });
  },
  computed: {
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
    meta: function () {
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
    "info bar"
    "cake social" 100% / 1fr 1fr;
  grid-gap: 2em;
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
  display: grid;
  grid-template-areas: "amount rate";
  font-size: 1.6em;
  font-weight: 600;
  color: #555555;
}

.amount {
  grid-area: amount;
}
.rate {
  grid-area: rate;
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
  padding-left: 1rem;
  padding-right: 1rem;
}

.numbers h3 {
  display: table-cell;
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
  margin-bottom: 0.5rem;
  margin-left: 0.5em;
  text-align: center;
  border-radius: 28px;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
  0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
  0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
@media screen and (max-width: 900px) {
  .g0v-container {
    grid-template:
      "info"
      "bar"
      "cake"
      "social" 100% / 1fr;
  }
  .details .numbers {
    grid-template-areas: "amount" "rate";
  }
}
</style>
