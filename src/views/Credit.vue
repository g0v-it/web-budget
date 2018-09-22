<template>
    <div class="container">
        <h1 id="webbudget">Budget.g0v.it</h1>

        <p>Una web app interattiva che visualizza il dati del bilancio italiano.</p>

        <p>Questa applicazione si ispira ai progetti sviluppati dalla
            <a href="http://gov.asia/">community di g0v</a> per
            <a href="https://github.com/g0v/twbudget">Taiwan</a> e
            <a href="https://github.com/tony1223/tw-budget-platform">Taipey</a>
        </p>

        <p>g0v is a decentralized civic tech community to advocate transparency of information and build tech solutions for citizens to participate in public affairs from the bottom up. The g0v community was born in Taiwan thanks to
            <a href="https://de.wikipedia.org/wiki/Audrey_Tang">Audrey Tang</a>,
            <a href="https://github.com/clkao">Chia-liang Kao</a> and many others.</p>

        <h2 id="data">Data</h2>
        <p> Tutti i dati visualizzati sono estratti dal
            <a href="https://bdap-opendata.mef.gov.it/tema/bilancio-finanziario-dello-stato-0">portale BDAP</a> e processati da uno
            <em>smart data management platform</em> (DMP) compatibile con gli standards del W3C Semantic Web. La piattaforma è disponibile
            <a href="https://git.copernicani.it/g0v/data-budget">qui</a>.
        </p>

        <h2 id="credits">Credits</h2>

        <ul>
            <li>
                <a href="https://github.com/miahmohd">Miah Mohd Ehtesham</a>,
                <a href="https://github.com/LeonardoLonghi">Leonardo Longhi</a> and
                <a href="https://github.com/luca">Luca Mearelli</a> for the webapp code design.</li>

            <li>
                <a href="https://github.com/ecow">Enrico Fagnoni</a>,
                <a href="https://github.com/YassineOuahidi">Yassine Ouahidi</a> and
                <a href="http://linkeddata.center">LinkedData.Center</a> for the smart data management platform </li>

            <li>
                <a href="https://bost.ocks.org/mike/">Mike Bostock</a> for the
                <a href="https://d3js.org/">D3.js library</a>
            </li>

            <li>
                <a href="http://evanyou.me/">Evan You</a> and he
                <a href="https://vuejs.org">Vue community</a> for the great framework</li>
        </ul>

        <p>Thanks to all project contributors, to the
            <a href="https://copernicani.it/">Copernicani community</a> and to the
            <a href="http://g0v.asia">g0v asia community</a> for ideas and support.</p>

        <h3 id="license">License</h3>

        <p class="license">The MIT License (MIT). Please see License File for more information.</p>
    </div>

</template>

<script>
export default {};
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
