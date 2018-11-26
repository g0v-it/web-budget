<template>
  <div class="legend">
    <div v-if="show_legend_radius" class="legend-radius">
      <svg height="200">
        <circle
          vector-effect="non-scaling-stroke" cx="137.5000000000001"
          cy="141.49999999999991" r="15"
          fill="none" stroke-width="1"
          stroke="rgb(190,190,190)"
        />
        <circle
          vector-effect="non-scaling-stroke" cx="115.00000000000009"
          cy="160.5" r="4"
          fill="none" stroke-width="1"
          stroke="rgb(190,190,190)"
        />
        <circle
          vector-effect="non-scaling-stroke" cx="208"
          cy="105.49999999999994" r="50"
          fill="none" stroke-width="1"
          stroke="rgb(190,190,190)"
        />
        <g transform="matrix(1,0,0,1,68,57.5)">
          <text transform="matrix(1,0,0,1,0,12.574)" style="font-family:&quot;Roboto Mono&quot;;font-weight:100;font-size:12px;font-style:normal;fill:#000000;stroke:none;">50.000 milioni</text>
        </g>
        <g transform="matrix(1,0,0,1,42.5,112.5)">
          <text transform="matrix(1,0,0,1,0,12.574)" style="font-family:&quot;Roboto Mono&quot;;font-weight:100;font-size:12px;font-style:normal;fill:#000000;stroke:none;">5.000 milioni</text>
        </g>
        <g transform="matrix(1,0,0,1,34,141.5)">
          <text transform="matrix(1,0,0,1,0,12.574)" style="font-family:&quot;Roboto Mono&quot;;font-weight:100;font-size:12px;font-style:normal;fill:#000000;stroke:none;">50 milioni</text>
        </g>
      </svg>
    </div>
    <div v-if="show_legend_colors" class="legend-colors">
      <small>{{string['$PERCENTAGE_EXPLANATION_TEXT']}}</small>
      <ul class="colors">
        <li class="change-dec3" />
        <li class="change-dec2" />
        <li class="change-dec1" />
        <li class="change-inc1" />
        <li class="change-inc2" />
        <li class="change-inc3" />
      </ul>

      <ul class="labels">
        <li>-25%</li>
        <li>-5%</li>
        <li>0</li>
        <li>+5%</li>
        <li>+25%</li>
      </ul>
    </div>
  </div>
</template>
<script>
import Configuration from "@/utils/configuration";
export default {
  data(){
    return{
      string:Configuration.current().strings
    }
  },
  props: {
    datasetMeta: Object
  },
  computed:{
    show_legend_radius : function(){
      return (window.innerHeight>700)
    },
    show_legend_colors : function(){
      return (window.innerHeight>540)
    }
  }
};
</script>

<style scoped>
.legend-colors {
  margin-top: auto;
  /*  max-width: 25em; */
}
.legend-colors .colors {
  list-style: none;
  margin: 0.5em 0;
  padding: 0;
  width: 100%;
  height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.legend-colors .labels {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.labels li {
  text-align: center;
  padding: 0;
  margin: 0;
  height: 1rem;
  width: 20%;
}

.colors li {
  padding: 0;
  margin: 0;
  height: 1rem;
  width: 16%;
}
/* ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"] */
.change-dec3 {
  background: #762a83;
}
.change-dec2 {
  background: #af8dc3;
}
.change-dec1 {
  background: #e7d4e8;
}
.change-inc1 {
  background: #b8e2ae;
}
.change-inc2 {
  background: #6cb366;
}
.change-inc3 {
  background: #1b7837;
}
</style>
