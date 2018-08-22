<template>
    <div ref="vis" id="vis" >
        <div ref="grid" v-if="partitionID!='default'" class="grid">
            <div v-for="(totAmount,label) in partitionBlocks" :key="label" class="grid-block">
                <h3 class="subheading" >{{label}}</h3> 
                <h3 class="title" >€ {{totAmount}}</h3> 
            </div>             
        </div>
        <BubbleGraphLegend v-if="partitionID=='default'" class="legend-layout" />
        <svg :height="svgSize.height" :width="svgSize.width">
            <circle class="bubble" v-for="node in nodes" :key="node.code" ></circle>
        </svg>
    </div>
</template>

<script>
/* VA SISTEMATO LA STRUTTURA GENERALE DELLO SCRIPT */
import BubbleGraphLegend from "@/components/BubbleGraphLegend.vue";
import rawData from "@/assets/example.json.js";
import labels from "@/assets/labels.json.js";

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
      radius: radiusScale(+d.amount),
      value: d.amount - d.last_amount,
      diff: (d.amount - d.last_amount) / d.amount * 100,
      partitions: d.partition,
      tags: d.tags,
      x: Math.random() * 900,
      y: Math.random() * 900
    };
  });
  return myNodes;
}

let fillColor = val => {
  let color = "#D84B2A";
  let bubbleHeight = 5;
  if (val > -25) {
    color = "#EE9586";
    bubbleHeight = 4;
  }
  if (val > -5) {
    color = "#E4B7B2";
    bubbleHeight = 3;
  }
  if (val > 0) {
    color = "#BECCAE";
    bubbleHeight = 2;
  }
  if (val > 5) {
    color = "#9CAF84";
    bubbleHeight = 1;
  }
  if (val > 25) {
    color = "#7AA25C";
    bubbleHeight = 0;
  }
  return color;
};

function calcCenterOfBlocks(childNodes) {
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

/* Vue component */
export default {
    components: {
    BubbleGraphLegend
  },
  props: {
    partitionID: String
  },
  data: () => {
    return {
      partitionBlocks: {},
      nodes: rawData.accounts,
      svgSize: {
        height: 0,
        width: 0
      }
    };
  },

  watch: {
    partitionID: function() {
      if (this.partitionID !== "default") {
        this.partitionBlocks = labels.partitions[this.partitionID];
      } else {
        this.partitionBlocks = {};
      }
    }
  },
  mounted() {
    this.svgSize.height = this.$refs.vis.offsetHeight;
    this.svgSize.width = this.$refs.vis.offsetWidth;

    /* Create chart */
    this.chart(rawData.accounts);
  },
  updated() {
    this.svgSize.height = this.$refs.vis.offsetHeight;
    this.svgSize.width = this.$refs.vis.offsetWidth;

    if (this.partitionID === "default") {
      this.groupBubbles();
    } else {
      let centers = calcCenterOfBlocks(this.$refs.grid.childNodes);
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

      let bubbles = d3
        .select("svg")
        .selectAll("circle")
        .data(nodes)
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
        .on("mouseover", d=>{
          this.$emit("over", d);
        })
        .on("mouseout", d=>{
          this.$emit("out", d);
        })

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

      this.groupBubbles();
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
