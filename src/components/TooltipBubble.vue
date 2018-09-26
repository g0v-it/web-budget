<template>
  <div class="bubble-tooltip card">
    <v-card-title class=" tooltipTitle headline grey lighten-2" primary-title>
      <p>{{ currentNode.top_level }}</p>
    </v-card-title>
    <v-card-text class="tooltipText">
      <h3>{{ currentNode.name }}</h3>
      <p>Percentuale: </p>
      <ul>
        <li>sul totale del bilancio: <b><rate :rate="currentNode.percentageOfTheTotalAmount" /></b></li>
        <li>sul ministero di appartenenza : <b><rate :rate="currentNode.percentageOfTheTopParition" /></b></li>
        <li>sulla missione di appartenenza: <b><rate :rate="currentNode.percentageOfTheSecondParition" /></b></li>
      </ul>
    </v-card-text>
    <div class="numberContainer">

      <div class="amount">
        <h3><amount :amount="currentNode.amount" /></h3>
      </div>
      <div class="diff" :style="{backgroundColor:bgColor}">
        <h3><rate :rate="currentNode.diff" /></h3>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentNode: Object,
    bgColor: String
  }
};
</script>
<style>
.bubble-tooltip {
  width: 25rem;
  min-height: 15rem;

  /*  z-index: 20; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.tooltipTitle {
  padding: 0;
  text-align: center;
}

.tooltipTitle p {
  width: 100%;
  font-size: 13px;
  margin: 0px;
}

.tooltipText {
  padding: 1em;
}

.tooltipText h3 {
  margin: 0 0 1em 0;
  font-weight: 500;
}
.tooltipText p {
  margin: 0rem;
}
.numberContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
  padding-left: 1rem;
  padding-right: 1rem;
}

.numberContainer h3 {
  display: table-cell;
  vertical-align: middle;
}
.numberContainer .amount {
  background-color: #fff;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
.numberContainer .diff {
  width: 8rem;
  color: #fff;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  border-radius: 28px;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.numberContainer .diff h3 {
  width: 8rem;
}
</style>
