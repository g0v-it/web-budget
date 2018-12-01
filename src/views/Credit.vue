<template>
  <div class="container">
    <h1 id="credits">
      Crediti
    </h1>

    <p>Questa applicazione è stata sviluppata grazie al fondamentale contributo di:</p>

    <ul>
      <li>
        <a href="https://github.com/miahmohd">
          Miah Mohd Ehtesham
        </a>,
        <a href="https://github.com/LeonardoLonghi">
          Leonardo Longhi
        </a> e
        <a href="https://github.com/luca">
          Luca Mearelli
        </a> per l&#8217; sviluppo del codice di visualizzazione
        dei dati.
      </li>
      <li>
        <a href="https://github.com/ecow">
          Enrico Fagnoni
        </a>,
        <a href="https://github.com/YassineOuahidi">
          Yassine Ouahidi
        </a> e
        <a href="http://linkeddata.center">
          LinkedData.Center
        </a> lo svilppo della piattaforma di gestione
        dei dati
      </li>
    </ul>

    <p>
      Tutto il codice, sia relativo alla visualizzazione sia della piattaforma di gestione dei dati è disponibile
      con licenza Open Source su 
      <a href="https://github.com/g0v-it">
        GitHub 
      </a>.
    </p>

    <p>
      Un ringraziamento di cuore a tutti i contributori  e  alle comunità che hanno sviluppato le librerie di
      codice senza cui questo progetto non esisterebbe. In particolare a  <a href="https://bost.ocks.org/mike/">
        Mike Bostock
      </a>
      per la realizzazione della libreria grafica <a href="https://d3js.org/">
        D3.js library
      </a>,
      <a href="http://evanyou.me/">
        Evan You
      </a> tutta la <a href="https://vuejs.org">
        Vue community
      </a> per il
      framework Javascript e a
      <a href="http://linkeddata.center/">
        <img
          :src="logo_linkeddatacenter" height="30px"
          style="vertical-align:middle;"
        >
        LinkedData.Center
      </a> per aver messo a disposizione la sua piattaforma SDaaS - community edition.
    </p>

    <p>
      Infine grazie a tutti i  <a href="https://copernicani.it/">
        Copernicani
      </a>, a
      <a href="https://de.wikipedia.org/wiki/Audrey_Tang">
        Audrey Tang
      </a>,
      <a href="https://github.com/clkao">
        Chia-liang Kao
      </a> e a tutta la <a href="http://g0v.asia">
        comunità g0v
        in asia
      </a> per il supporto e i preziosi consigli.
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    logo_linkeddatacenter() {
      return require("@/assets/linkeddatacenter.svg");
    }
  }
};
</script>

<style scoped>
.container p {
  color: #444444;
}
h1,
h2,
h3 {
  font-weight: 500;
  margin: 0 0 0.4em 0;
}

p.license {
  font-size: 0.9em;
  color: #777777;
}
</style>
