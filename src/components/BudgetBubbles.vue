<template>
  <div ref="vis" class="vis">
    <div
      ref="grid" v-if="partitionId !== 'default'"
      :class="{ 'grid': true, 'grid-one-line': partitionBlocks.length === 2 }"
    >
      <div
        v-for="block in partitionBlocks" :key="block.label"
        class="grid-block"
      >
        <h3 class="subheading">
          {{ block.label }}
        </h3>
        <!-- amount da calcolare in base al filtro -->
        <h3 class="title">
          <Amount :amount="block.filteredAmount" />
        </h3>
      </div>
    </div>

    <svg id="bubbles" />
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
let minRadius;
let maxRadius;

/* Vue component */
export default {
  props: {
    accounts: Array,
    partitionId: String,
    partitionLabels: Object,
    filters: Object
  },

  data() {
    return {
      center_x: 0,
      center_y: 0
    };
  },

  computed: {
    partitionBlocks: function() {
      return this.partitionId !== "default"
        ? this.partitionLabels[this.partitionId].partitions
        : [];
    }
  },

  watch: {
    filters: {
      handler: debounce(function() {
        this.filterBubbles();
      }, 500),
      deep: true
    }
  },

  mounted() {
    if (this.accounts.length > 0) {
      this.chart(this.accounts);
      this.toggleGrouping();
      this.filterBubbles();
    }
    window.addEventListener(
      "resize",
      debounce(() => {
        this.toggleGrouping();
      }, 500)
    );
  },

  updated() {
    this.toggleGrouping();
  },

  beforeDestroy() {
    window.removeEventListener("resize");
  },

  methods: {
    chart(rawData) {
      let createNodes = rawData => {
        let maxAmount = d3.max(rawData, function(d) {
          return +d.amount;
        });
        let minAmount = d3.min(rawData, function(d) {
          return +d.amount;
        });
        let maxRate = d3.max(rawData, function(d) {
          let rate = (d.amount - d.previousValue) / d.previousValue;
          return isFinite(rate) ? rate : 0;
        });
        let minRate = d3.min(rawData, function(d) {
          let rate = (d.amount - d.previousValue) / d.previousValue;
          return isFinite(rate) ? rate : 0;
        });
        let maxRadius_x, minRadius_x, maxRadius_y, minRadius_y;
        if (window.innerWidth < 713) {
          maxRadius_x = 70;
          minRadius_x = 1;
          this.center_x = this.$refs.vis.offsetWidth / 2;
        } else if (window.innerWidth < 992) {
          maxRadius_x = 70;
          minRadius_x = 2;
          this.center_x = this.$refs.vis.offsetWidth / 3;
        } else if (window.innerWidth < 1050) {
          maxRadius_x = 80;
          minRadius_x = 2;
          this.center_x = this.$refs.vis.offsetWidth / 2;
        } else {
          maxRadius_x = 90;
          minRadius_x = 3;
          this.center_x = this.$refs.vis.offsetWidth / 2;
        }
        console.log(window.innerHeight);
        console.log(window.innerWidth);
        if (window.innerHeight < 400) {
          maxRadius_y = 40;
          minRadius_y = 1;
          this.center_y = (this.$refs.vis.offsetHeight * 7) / 16;
        } else if (window.innerHeight < 600) {
          maxRadius_y = 50;
          minRadius_y = 1;
          this.center_y = (this.$refs.vis.offsetHeight * 7) / 16;
        } else {
          maxRadius_y = 90;
          minRadius_y = 2;
          this.center_y = this.$refs.vis.offsetHeight / 2;
        }
        maxRadius = Math.min(maxRadius_x, maxRadius_y);
        minRadius = Math.min(minRadius_x, minRadius_y);
        console.log("MINIMOX,", maxRadius);
        console.log("MASSIMOX", minRadius);

        let powRadiusScale = d3
          .scalePow()
          .exponent(0.5)
          .domain([minAmount, maxAmount])
          .range([minRadius, maxRadius]);
        let linearRadiusScale = d3
          .scaleLinear()
          .domain([minAmount, maxAmount])
          .range([minRadius, maxRadius]);
        let heightScale = d3
          .scalePow()
          /* .clamp(true) */
          .exponent(0.1)
          .domain([minRate, maxRate])
          .range([this.$refs.vis.offsetHeight, 0]);

        let myNodes = rawData.map(d => {
          let diff = (d.amount - d.previousValue) / d.previousValue;
          let diffForHeight = isFinite(diff) ? diff : -0.000001;
          return {
            id: d.code,
            title: d.title,
            subject: d.subject,
            radiusPow: powRadiusScale(+d.amount),
            radiusLinear: linearRadiusScale(+d.amount),
            amount: d.amount,
            diff: diff,
            partitionLabel: d.partitionLabel,
            x: (Math.random() / 2 + 0.25) * this.$refs.vis.offsetWidth,
            y: heightScale(diffForHeight)
          };
        });
        return myNodes;
      };

      // convert raw data into nodes data
      nodes = createNodes(rawData);
      let touched_node;
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
        .on("touchstart", function(d) {
          touched_node = d;
        })
        .on("touchmove", function(d) {
          if (touched_node != d) touched_node = null;
        })
        .on("touchend", function(d) {
          if (touched_node != null) temp.$emit("click", d);
        })
        .on("mouseover", function(d) {
          this.style["stroke-width"] = 3;
          temp.$emit("over", {
            ...d,
            radius: this.scaleLinear ? d.radiusLinear : d.radiusPow,
            colorBg: fillColor(d.diff),
            x: d.x,
            y: d.y
          });
          //}
        })
        .on("mouseout", function(d) {
          this.style["stroke-width"] = 1;
          temp.$emit("out", d);
        });

      bubbles
        .transition()
        .duration(2000)
        .attr("r", function(d) {
          return d.radiusPow;
        });

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
        return -Math.pow(d.radiusPow, 2.0) * forceStrength;
      }

      simulation = d3
        .forceSimulation()
        .velocityDecay(velocityDecay)
        .nodes(nodes)
        .force("charge", d3.forceManyBody().strength(charge))
        .on("tick", ticked)
        .stop();
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
      console.log(group_cat_id);
      
      for (let i = 0; i < nodes.length; ++i) {
        let center = group_cat_id.labels.find(function(el) {
          return  nodes[i].partitionLabel.includes(el.value);
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
      if (this.partitionId === "default") {
        this.groupBubbles();
      } else {
        let centers = calcCenterOfBlocks(this.$refs.grid.childNodes);

        for (let i = 0; i < this.partitionBlocks.length; i++) {
          centers[i].value = this.partitionBlocks[i].label;
        }

        let groupCatId = {
          partition: this.partitionId,
          labels: centers
        };
        console.log(groupCatId)
        this.splitBubbles(groupCatId);
      }
    },
    filterBubbles() {
      d3.select("#bubbles")
        .selectAll("circle")
        .classed("disabled", d => {
          if (filterPassed(d, this.filters)) {
            return false;
          } else {
            return true;
          }
        });
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
  grid-template-columns: repeat(auto-fit, minmax(25em, 1fr));
  grid-auto-rows: 30rem;
  pointer-events: all;
}

@media screen and (min-width: 900px) {
  .grid-one-line {
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 100%;
  }
}

.grid .subheading,
.grid .title {
  z-index: 1;
  text-align: center;
}
.grid .grid-block {
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
