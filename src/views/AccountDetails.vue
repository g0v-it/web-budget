<template>
  <div class="g0v-container">
    <v-card class="details">
      <h2>{{ currentNode.name }}</h2>
      <p class="top">Ministero: {{ currentNode.top_level }}</p>
      <p v-if="download_completed" class="second">Missione: {{ currentNode.partitions.second_partition }}</p>
      <p class="description">{{ currentNode.description }}</p>
      <a target="_blank" :href="currentNode.account"> <p class="link">Visualizza i linked-data.</p></a>
      <div class="numbers">
        <p class="amount"><small>Spesa: </small><amount :amount="currentNode.amount" /> </p>
        <p class="rate"><small>Inc. dall'ultima spesa: </small><rate :rate="(currentNode.amount- currentNode.last_amount )/currentNode.last_amount" /></p>
      </div>
    </v-card>
    <v-card class=" history">
      <h2>Storico dell'azione</h2>
      <HistoryChart
        v-if="download_completed" :values="history"
        style=""
      />
    </v-card>
    <v-card class="partition">
      <h2>Suddivisione in capitoli di spesa</h2>
      <CdsChart
        v-if="download_completed" :values="{lower_partition:currentNode.cds,sum:currentNode.amount}"
        style=""
      />
    </v-card>
    <v-card class="comments">
      <h2>Spazio per social</h2>
    </v-card>
  </div>

</template>

<script>
import HistoryChart from "@/components/HistoryChart.vue";
import CdsChart from "@/components/CdsChart.vue";

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
