<template>
    <div ref="vis" class="vis">
        <div ref="grid" v-if="partitionID != 'default'" class="grid">
            <div v-for="block in partitionBlocks" :key="block[partitionID]" class="grid-block">
                <h3 class="subheading">{{block[partitionID]}}</h3>
                <h3 class="title">€ {{block.amount}}</h3>
            </div>
        </div>

        <svg id="bubbles"></svg>
    </div>
</template>

<script>
import { fillColor, calcCenterOfBlocks } from "@/utils/functions.js";
import * as d3 from "d3";

let simulation;
let velocityDecay = 0.2;
let forceStrength = 0.03;
let nodes;

function createNodes(rawData) {
  let maxAmount = d3.max(rawData, function(d) {
    return +d.amount;
  });
  let minAmount = d3.min(rawData, function(d) {
    return +d.amount;
  });
  // Sizes bubbles based on .
  let radiusScale = d3
    .scalePow()
    .exponent(0.5)
    .range([3, 90])
    .domain([minAmount, maxAmount]);

  let myNodes = rawData.map(function(d) {
    return {
      id: d.code,
      name: d.name,
      top_level: d.top_level,
      radius: radiusScale(+d.amount),
      amount: d.amount,
      diff: (d.amount - d.last_amount) / d.last_amount * 100,
      partitions: d.partitions,
      tags: d.tags,
      x: Math.random() * 900,
      y: Math.random() * 900
    };
  });

  /*   myNodes = myNodes.sort((a,b)=>{
        return b.amount - a.amount;
    })
 */
  return myNodes;
}

/* Vue component */
export default {
  props: {
    partitionID: String,
    partitionLabels: Object
  },
  data: () => {
    return {
      partitionBlocks: [],
      svgSize: {
        height: 0,
        width: 0
      }
    };
  },

  watch: {
    partitionID: function() {
      if (this.partitionID !== "default") {
        this.partitionBlocks = this.partitionLabels[this.partitionID];
      } else {
        this.partitionBlocks = [];
      }
    }
  },
  /* created() {
    if (this.partitionID !== "default") {
      this.partitionBlocks = this.partitionLabels[this.partitionID];
    } else {
      this.partitionBlocks = [];
    }
  }, */
  mounted() {
    this.$http.getAccounts().then(res => {
      this.chart(res.accounts);
      this.svgSize.height = this.$refs.vis.offsetHeight;
      this.svgSize.width = this.$refs.vis.offsetWidth;
      this.groupBubbles();
      console.log("mounted", this.partitionID);
      /* if (this.partitionID) {
        this.partitionBlocks = this.partitionLabels[this.partitionID];
        console.log("this.partitionID da  budget", this.partitionID);
      } */
    });
    /* console.log('this.$refs.vis',this.$refs.vis.offsetHeight ); */
  },

  updated() {
    console.log("this.partitionID da  budget update", this.partitionID);
    this.svgSize.height = this.$refs.vis.offsetHeight;
    this.svgSize.width = this.$refs.vis.offsetWidth;

    if (this.partitionID === "default") {
      this.groupBubbles();
    } else {
      let centers = calcCenterOfBlocks(this.$refs.grid.childNodes);

      for (let i = 0; i < this.partitionBlocks.length; i++) {
        centers[i].value = this.partitionBlocks[i][this.partitionID];
      }

      let groupCatId = {
        partition: this.partitionID,
        labels: centers
      };

      this.splitBubbles(groupCatId);
    }
  },

  methods: {
    chart(rawData) {
      // convert raw data into nodes data
      nodes = createNodes(rawData);

      function ticked() {
        bubbles
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
      }

      function charge(d) {
        return -Math.pow(d.radius, 2.0) * forceStrength;
      }
      let temp = this;

      let bubbles = d3
        .select("#bubbles")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .classed("bubble", true)
        .attr("r", 0)
        .attr("fill", function(d) {
          return fillColor(d.diff);
        })
        .attr("stroke", function(d) {
          return d3.rgb(fillColor(d.diff)).darker();
        })
        .attr("stroke-width", 1)
        .attr("pointer-events", "all")
        .on("click", d => {
          this.$emit("click", d);
        })
        .on("mouseover", function(d) {
          this.style["stroke-width"] = 2;
          temp.$emit("over", {
            d,
            colorBg: fillColor(d.diff),
            darkerColor: d3
              .rgb(fillColor(d.diff))
              .darker()
              .hex(),
            x: d.x,
            y: d.y
          });
        })
        .on("mouseout", function(d) {
          this.style["stroke-width"] = 1;
          temp.$emit("out", d);
        });

      bubbles
        .transition()
        .duration(2000)
        .attr("r", function(d) {
          return d.radius;
        });

      simulation = d3
        .forceSimulation()
        .velocityDecay(velocityDecay)
        .nodes(nodes)
        .force("charge", d3.forceManyBody().strength(charge))
        .on("tick", ticked)
        .stop();

      /*    this.groupBubbles(); */
    },
    groupBubbles() {
      simulation.force(
        "x",
        d3
          .forceX()
          .strength(forceStrength)
          .x(this.svgSize.width / 2)
      );
      simulation.force(
        "y",
        d3
          .forceY()
          .strength(forceStrength)
          .y(this.svgSize.height / 2)
      );

      simulation.alpha(1).restart();
    },
    splitBubbles(group_cat_id) {
      //assign center to bubble

      for (let i = 0; i < nodes.length; ++i) {
        let center = group_cat_id.labels.find(function(el) {
          return el.value == nodes[i].partitions[group_cat_id.partition];
          console.log("nodes", nodes);
        });
        nodes[i].group_center = { x: center.x, y: center.y };
      }

      simulation.force(
        "x",
        d3
          .forceX()
          .strength(forceStrength)
          .x(function(d) {
            return d.group_center.x;
          })
      );
      simulation.force(
        "y",
        d3
          .forceY()
          .strength(forceStrength)
          .y(function(d) {
            return d.group_center.y;
          })
      );

      // @v4 We can reset the alpha value and restart the simulation
      simulation.alpha(1).restart();
    }
  }
};
</script>

<style>
.vis {
  position: relative;
  height: 100%;
  width: 100%;
}

#bubbles {
  z-index: 1;
  height: 100%;
  width: 100%;
  top: 0;
  position: absolute;
  pointer-events: none;
}
.grid {
  text-align: center;
  display: grid;
  /*   grid-gap: 1rem; */
  grid-row-gap: 2rem;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 30rem 20rem 20rem 20rem 20rem 20rem 15rem 15rem 15rem;
}
.grid .subheading {
  /*   z-index: 1; */
  text-align: center;
}
.grid .grid-block {
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  /*   justify-content: space-between; */
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
