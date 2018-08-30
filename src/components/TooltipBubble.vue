<template>
    <div class="bubble-tooltip card">
        <v-card-title class=" tooltipTitle headline grey lighten-2" primary-title>
            <p>{{currentNode.topLevel}}</p>
        </v-card-title>
        <v-card-text class="tooltipText">
            <p>{{currentNode.name}}</p>
        </v-card-text>
        <div class="numberContainer">

            <div class="amount">
                <h3>{{currentNode.amount}}</h3>
            </div>
            <div class="diff" :style="{backgroundColor:bgColor}">
                <h3>{{currentNode.diff}}</h3>
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
  width: 100%;
  height: 15rem;
  position: absolute;
  /*  z-index: 20; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.tooltipTitle {
  padding: 0rem;
  text-align: center;
}

.tooltipTitle p {
  width: 100%;
  font-size: 13px;
  margin: 0px;
}

.tooltipText {
  padding: 0rem;
}
.tooltipText p {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.1rem;
  font-size: 13px;
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

