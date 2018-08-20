<template>
    <div>
        <div ref="grid" class="grid">
            <div v-for="(label, totAmount) in partitionBlocks" :key="label" class="grid-block">
                {{totAmount}}
            </div>             
        </div>
        <div id="vis" v-bind:style="{ height: 100 + '%', width: 100 + '%' }"></div>
    </div>
</template>


<script>
import * as BubbleGraphController from "@/controllers/BubbleGraphController.js";
import rawData from "@/assets/example.json.js";
import labels from "@/assets/labels.json.js";

export default {
  props: {
    partitionID: String,
    height: Number,
    width: Number
  },
  data: () => {
    return {
      partitionBlocks: {}
    };
  },

  watch: {
    partitionID: function() {
      //setto partition block con le possibili label:tot.
      this.partitionBlocks = labels.partitions[this.partitionID];
      console.log(this.partitionBlocks);
      //calcolo i cen
      //chiamo funzione di partizionamento
    }
  },

  mounted() {
    //(selector, rawData, width_p, height_p)
    BubbleGraphController.chart(
      "#vis",
      rawData.accounts,
      this.width,
      this.height
    );
  },
  updated() {
    let centers = this.calcCenterOfBlocks(this.$refs.grid.childNodes);
    console.log(centers, this.partitionID);
    //aggiornare il grafico
    let labels = centers;

    for (let i = 0; i < Object.keys(this.partitionBlocks).length; i++) {
      centers[i].value = Object.keys(this.partitionBlocks)[i];
    }

    for (const key in this.partitionBlocks) {
      if (this.partitionBlocks.hasOwnProperty(key)) {
        labels;
      }
    }

    let groupCatId = {
      partition: this.partitionID,
      labels: centers
    };
    
    BubbleGraphController.splitBubbles(groupCatId);
  },

  methods: {
    calcCenterOfBlocks(childNodes) {
      let centers = [];
      for (const key in childNodes) {
        if (childNodes.hasOwnProperty(key)) {
          const c = {
            x: childNodes[key].offsetLeft + childNodes[key].offsetWidth / 2,
            y: childNodes[key].offsetTop + childNodes[key].offsetHeight / 2
          };
          centers.push(c);
        }
      }
      return centers;
    }
  }
};
</script>

<style>
.grid {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 25rem;
}

.grid > .grid-block {
  background: #eeeeee;
}
.grid > .grid-block:nth-child(odd) {
  background: #dddddd;
}

#vis {
  z-index: 10;
  background: #d4d4d4;
}

@media screen and (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
