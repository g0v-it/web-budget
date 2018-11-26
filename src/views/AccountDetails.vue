<template>
  <div class="g0v-container">
    <v-card class="details">
      <h2>{{ currentNode.title }}
        <a
          target="_blank"
          :href="currentNode.source"
          alt="Visualizza i linked data"
          title="Visualizza i linked-data"
        >
          <img :src="logo_rdf" class="g0v-rdf-logo">
        </a>
      </h2>
      <span><p v-for="(l,index) in currentNode.partitionLabel" :key="index" class="top"> {{l+"  "}}</p></span>

      <p class="description">{{ currentNode.description | capitalize }}</p>
      <div class="numbers">
        <p class="amount"><amount :amount="currentNode.amount" /></p>
        <div class="rate">
          <small>{{ string['$PERCENTAGE_EXPLANATION_TEXT'] }} {{ currentNode.version - 1 }}
            <span v-if="!variation_available">{{ string['$VARIATION_NOT_AVAILABLE'] }}</span>
          </small>
          <div
            v-if="variation_available" class="diff"
            :style="{backgroundColor:currentNode.bgColor}"
          >
            <h3><rate :rate="currentNode.diff" /></h3>
          </div>
        </div>
      </div>
    </v-card>
    <v-card class=" history">
      <h2>{{ string['$HISTORY_CARD_TITLE'] }}</h2>
      <HistoryChart v-if="currentNode.isVersionOf.length!=0"
        :values="history"
        :dataset-meta="budget.meta"
        style=""
      />
      <p v-if="currentNode.isVersionOf.length==0">{{ string['$HISTORY_NOT_AVAILABLE'] }}</p>
    </v-card>
    <v-card v-if="currentNode.hasPart.length!=0" class="partition">
      <h2>{{ string['$LOWER_PARTITION_CARD_TITLE'] }}</h2>
      <CdsChart
        :values="{lower_partition:currentNode.cds,sum:currentNode.amount}"
        style=""
      />
    </v-card>
    <v-card v-if="show_comment" class="comments">
      <TweetsWall />
    </v-card>
  </div>

</template>

<script>
import HistoryChart from "@/components/HistoryChart.vue";
import CdsChart from "@/components/CdsChart.vue";
import TweetsWall from "@/components/TweetsWall.vue";
import { fillColor } from "@/utils/functions.js";
import * as BudgetStore from "@/budgetStore.js";
import fileString from "@/assets/string.js";

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
      string: fileString,
      currentNode: {}
    };
  },

  async beforeRouteEnter(to, from, next) {
    if (Object.keys(BudgetStore.state.meta).length === 0) {
      await Promise.all([
        BudgetStore.actions.readAccounts(),
        BudgetStore.actions.selectNode(to.params.code)
      ]);
    } else {
      await BudgetStore.actions.selectNode(to.params.code);
    }
    next();
  },
  created() {
    this.currentNode = this.budget.selectedNode;
    this.currentNode.diff =
      (this.currentNode.amount - this.currentNode.last_amount) /
      this.currentNode.last_amount;
    this.currentNode.bgColor = fillColor(this.currentNode.diff);
  },
  computed: {
    logo_rdf() {
      return require("@/assets/rdf_flyer.svg");
    },
    show_comment(){
      //valore sarà settato dal file di configurazione
      return false;
    },
    variation_available() {
      return isFinite(this.currentNode.diff);
    },
    history: function() {
      var history = this.currentNode.past_values;
      history["current"] = this.currentNode.amount;
      return history;
    },
    budget: function() {
      return this.$root.$data.budgetState;
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
    "info bar" 1fr
    "cake social" minmax(50%, auto) / 1fr 1fr;
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
