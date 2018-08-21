<template>
    <div ref="vis" id="vis" >
        <div ref="grid" class="grid">
            <div v-for="(totAmount,label) in partitionBlocks" :key="label" class="grid-block">
                <h3 class="subheading" >{{label}}</h3> 
                <h3 class="title" >€ {{totAmount}}</h3> 
            </div>             
        </div>
        <svg :height="svgSize.height" :width="svgSize.width">
            <circle @mouseover="bubbleMouseOverHandler" @mouseout="bubbleMouseOutHandler" :code="JSON.stringify(node)" class="bubble" v-for="node in nodes" :key="node.code" ></circle>
        </svg>
        <TooltipBubble v-if="tooltipVisible"  topLevel="ministero-1" title="titolo-1" :amount="111111" v-bind:diff="30" color="#BECCAE" ></TooltipBubble>
    </div>
</template>

<script>
import * as BubbleGraphController from "@/controllers/BubbleGraphController.js";
import rawData from "@/assets/example.json.js";
import labels from "@/assets/labels.json.js";
import TooltipBubble from "@/components/TooltipBubble.vue"

export default {
   components: {
    TooltipBubble
  },
  props: {
    partitionID: String
  },
  data: () => {
    return {
      partitionBlocks: {},
      nodes: rawData.accounts,
      currentNode:{},
      tooltipVisible:false,
      svgSize: {
        height: 0,
        width: 0
      }
    };
  },

  watch: {
    partitionID: function() {
      if (this.partitionID !== "default") {
        this.partitionBlocks = this.sortBlocks(
          labels.partitions[this.partitionID]
        );
        console.log(this.partitionBlocks);
      } else {
        this.partitionBlocks = {};
      }
    }
  },
  mounted() {
    this.svgSize.height = this.$refs.vis.offsetHeight;
    this.svgSize.width = this.$refs.vis.offsetWidth;

    BubbleGraphController.chart(
      rawData.accounts,
      this.svgSize.width,
      this.svgSize.height
    );
  },
  updated() {
    this.svgSize.height = this.$refs.vis.offsetHeight;
    this.svgSize.width = this.$refs.vis.offsetWidth;

    if (this.partitionID === "default") {
      BubbleGraphController.groupBubbles();
    } else {
      let centers = this.calcCenterOfBlocks(this.$refs.grid.childNodes);
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
    }
  },

  methods: {
    bubbleMouseOverHandler(ev) {
      console.log(ev.target.attributes[0].value)
      this.tooltipVisible=true;   
    },
    bubbleMouseOutHandler(ev) {
      this.tooltipVisible=false;        
    },
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
    },
    //temp function
    sortBlocks(blocks) {
      let sortable = [];
      for (let key in blocks) {
        sortable.push([key, blocks[key]]);
      }
      sortable.sort(function(a, b) {
        return b[1] - a[1];
      });
      let newBlocks = {};
      sortable.map(b => {
        newBlocks[b[0]] = b[1];
      });
      console.log(newBlocks);
      return newBlocks;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 2px;
  min-width: 0;
  position: relative;
  text-decoration: none;
  -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
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
  pointer-events: none;
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
