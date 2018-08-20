<template>

        <!-- <div ref="grid" class="grid">
            <div v-for="(label, totAmount) in partitionBlocks" :key="label" class="grid-block">
                {{totAmount}}
            </div>             
        </div> -->

        <div ref="vis" id="vis" >
            <div ref="grid" class="grid">
                <v-card v-for="(totAmount,label) in partitionBlocks" :key="label" class="grid-block">
                    <h3 class="subheading">{{label}}</h3>
                </v-card>             
            </div>
        </div>

</template>


<script>
import * as BubbleGraphController from "@/controllers/BubbleGraphController.js";
import rawData from "@/assets/example.json.js";
import labels from "@/assets/labels.json.js";

export default {
  props: {
    /*     height: Number,
    width: Number, */
    partitionID: String
  },
  data: () => {
    return {
      partitionBlocks: {}
    };
  },

  watch: {
    partitionID: function() {
      if (this.partitionID !== "default") {
        this.partitionBlocks = labels.partitions[this.partitionID];
        console.log(this.partitionBlocks);
      } else {
        this.partitionBlocks = {};
      }
    }
  },
  mounted() {
    BubbleGraphController.chart(
      "#vis",
      rawData.accounts,
      this.$refs.vis.offsetWidth,
      this.$refs.vis.offsetHeight
    );
  },
  updated() {
    if (this.partitionID === "default") {
      BubbleGraphController.groupBubbles(
        this.$refs.vis.offsetWidth,
        this.$refs.vis.offsetHeight
      );
    } else {
      let centers = this.calcCenterOfBlocks(this.$refs.grid.childNodes);
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

      BubbleGraphController.splitBubbles(
        groupCatId,
        this.$refs.grid.offsetWidth,
        this.$refs.grid.offsetHeight
      );
    }
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
  text-align: center;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 25rem;
}
.grid > .subheading {
  text-align: center;
}
.grid > .grid-block {
  padding: 1rem;
}
#vis {
  position: relative;
  height: 100%;
  width: 100%;
  /*  background: #d4d4d4; */
}

#vis > svg {
  z-index: 1;
  position: absolute;
  top: 0;
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
