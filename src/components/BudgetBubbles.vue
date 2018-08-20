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

export default {
  props: {
    height: Number,
    width: Number
  },
  data: () => {
    return {
      partitionBlocks: {
        /* "Debito pubblico": 167,
        "Politiche economico-finanziarie e di bilancio e tutela della finanza pubblica": 1287,
        asfudbabf0: 35468,
        argrdgrgbatsh: 5554,
        jdfyhnfyj: 13874,
        ncfjnync: 3184,
        oijoijoirj: 341548 */
      }
    };
  },
  mounted() {
    //(selector, rawData, width_p, height_p)
    BubbleGraphController.chart(
      "#vis",
      rawData.accounts,
      this.width,
      this.height
    );
    let centers = this.calcCenterOfBlocks(this.$refs.grid.childNodes);
    console.log(centers);
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
