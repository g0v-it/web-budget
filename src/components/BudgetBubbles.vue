<template>
        <div ref="vis" id="vis" >
            <div ref="grid" class="grid">
                <div v-for="(totAmount,label) in partitionBlocks" :key="label" class="grid-block">
                    <h3 class="subheading" >{{label}}</h3> 
                    <h3 class="title" >€ {{totAmount}}</h3> 
                </div>             
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
