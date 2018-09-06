<template>
    <div ref="vis" class="vis">

        <div ref="grid" v-if="partitionID !== 'default'" class="grid">
            <div v-for="block in partitionBlocks" :key="block[partitionID]" class="grid-block">
                <h3 class="subheading">{{block[partitionID]}}</h3>
                <!-- amount da calcolare in base al filtro -->
                <h3 class="title">€ {{block.amount}}</h3>

            </div>
        </div>

        <svg id="bubbles"></svg>
        <!--         <h3 class="overthetop" v-if="partitionID==='default'">totale spesa: € {{total}}</h3>
        <h3 class="overthetop" v-if="show_total_filtered">totale spesa bolle visibili: € {{total_filtered}}</h3> -->
    </div>
</template>

<script>
import {
  fillColor,
  filterPassed,
  calcCenterOfBlocks
} from "@/utils/functions.js";
import * as d3 from "d3";
import { debounce } from "lodash";
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
      x: Math.random() * 1000,
      y: Math.random() * 500
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
    accounts: Array,
    partitionID: String,
    partitionLabels: Object,
    filters: Object
  },

  data: () => {
    return {
      total: 0,
      show_total_filtered: false,
      total_filtered: 0,
      total_partition_filtered: { top_partition: {}, second_partition: {} }
    };
  },

  computed: {
    partitionBlocks: function() {
      return this.partitionID !== "default"
        ? this.partitionLabels[this.partitionID]
        : [];
    }
  },

  watch: {
    filters: {
      handler: debounce(
        function() {
          this.show_total_filtered =
            this.partitionID === "default" &&
            (this.filters.top_partition.length !== 0 ||
              this.filters.second_partition.length !== 0);
          this.filterBubbles();
        },
        500
      ),
      deep: true
    },
    accounts: function(val, oldVal) {
      this.chart(val);
      this.toggleGrouping();
      this.filterBubbles();
    }
  },

  mounted() {
    console.log(this.partitionID);

    if (this.accounts.length > 0) {
      this.chart(this.accounts);
      this.toggleGrouping();
      /* this.filterBubbles(); */
    }
  },

  updated() {
    if (this.accounts.length > 0) {
      this.toggleGrouping();
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
          .x(this.$refs.vis.offsetWidth / 2)
      );
      simulation.force(
        "y",
        d3
          .forceY()
          .strength(forceStrength)
          .y(this.$refs.vis.offsetHeight / 2)
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
    },
    toggleGrouping() {
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
    filterBubbles() {
      this.total = 0;
      this.total_filtered = 0;
      this.total_partition_filtered = {
        top_partition: {},
        second_partition: {}
      };

      let bubbles = d3
        .select("#bubbles")
        .selectAll("circle")
        .classed("disabled", d => {
          if (
            this.total_partition_filtered.top_partition[
              d.partitions.top_partition
            ] == undefined
          )
            this.total_partition_filtered.top_partition[
              d.partitions.top_partition
            ] = 0;
          if (
            this.total_partition_filtered.second_partition[
              d.partitions.second_partition
            ] == undefined
          )
            this.total_partition_filtered.second_partition[
              d.partitions.second_partition
            ] = 0;
          this.total += parseFloat(d.amount);
          if (filterPassed(d, this.filters)) {
            this.total_partition_filtered.top_partition[
              d.partitions.top_partition
            ] += parseFloat(d.amount);
            this.total_partition_filtered.second_partition[
              d.partitions.second_partition
            ] += parseFloat(d.amount);
            this.total_filtered += parseFloat(d.amount);
            return false;
          } else {
            return true;
          }
        });
      console.log("filtered partitions", this.total_partition_filtered);
      console.log('total', this.total);
      console.log('total filtered', this.total_filtered);
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
.overthetop {
  z-index: 2;
}
#bubbles {
  height: 100%;
  width: 100%;
  top: 0;
  position: absolute;
  pointer-events: none;
}

#bubbles circle.bubble {
  pointer-events: all;
  stroke-width: 1px;
  opacity: 1;
  transition: opacity 0.5s;
}

#bubbles circle.disabled {
  pointer-events: none;
  opacity: 0.2;
}

.grid {
  text-align: center;
  display: grid;
  /*   grid-gap: 1rem; */
  grid-row-gap: 2rem;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 30rem 20rem 20rem 20rem 20rem 20rem 15rem 15rem 15rem;
  pointer-events: all;
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
