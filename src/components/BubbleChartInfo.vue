<template>
  <div class="legend">
    <div class="legend-description">
      <h2 class="title">Legge di Bilancio {{ datasetMeta.year }}
        <a target="_blank" :href="datasetMeta.source">
          <img :src="logo_rdf" class="g0v-rdf-logo">
        </a>
      </h2>
      <p v-if="show_description" class="description">{{ datasetMeta.description }}</p>
      <p>Aggiornato al {{ datasetMeta.update }}</p>
      <p>Spese totali: <b> <amount :amount="totAmount.amount" /></b></p>
      <p v-if="totAmount.amount !== totAmount.filteredAmount">Spese filtrate: <b> <amount :amount="totAmount.filteredAmount" /></b></p>
    </div>
    <div class="legend-mef">
      <a :href="url_mef" target="_blank">
        <small>Elaborazione su dati del Ministero dell'Economia e delle Finanze</small>
        <v-img
          v-if="logo_mef_show" :src="logo_mef"
          class="g0v-mef-logo"
        />
      </a>
    </div>
  </div>
</template>

<script>
import Configuration from "@/utils/configuration";

export default {
  props: {
    datasetMeta: Object,
    totAmount: Object
  },
  computed: {
    logo_rdf() {
      return require("@/assets/rdf_flyer.svg");
    },
    logo_mef() {
      return require("@/assets/logo_mef.svg");
    },
    logo_mef_show() {
      return Configuration.current().showMefLogo;
    },
    url_mef() {
      return Configuration.current().mefLogoUrl;
    },
    show_description: function() {
      return window.innerHeight > 570;
    }
  }
};
</script>

<style scoped>
.legend {
  padding: 2em 0;
  height: 100%;
}

.legend-description .description {
  padding: 1rem 0;
  margin: 0;
}
.legend-mef {
  margin: 1em 0;
  position: absolute;
}
.g0v-mef-logo {
  max-width: 50px;
}
.g0v-rdf-logo {
  height: 20px;
  vertical-align: middle;
}
</style>
