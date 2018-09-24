<template>
    <div><svg class="chart js-chart"></svg></div>
</template>
<script>
import * as d3 from "d3";
//---------------------------------------------------------
//BUILDER
  let width=500;
  let height=500;
  let outerRadius=150;
  let innerRadius=0;
   /* global d3, document, window */
  function pieChart (options) {
    var animationDuration = 750,
      color = d3.scaleOrdinal(d3.schemeCategory10),
      data = [],
      innerRadius = 0,
      outerRadius = 100,
      arc = d3.arc(),
      pie = d3.pie()
        .sort(null)
        .value(function (d) {
          return d.amount;
        });

    function updateTween (d) {
      var i = d3.interpolate(this._current, d);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    function exitTween (d) {
      var end = Object.assign({}, this._current, { startAngle: this._current.endAngle });
      var i = d3.interpolate(d, end);
      return function(t) {
        return arc(i(t));
      };
    }

    function joinKey (d) {
      return d.data.name;
    }

    function pieChart (context) {
      
      var slices = context.selectAll('.slice').data(pie(data), joinKey);

      var oldSlices = slices.exit();

      var newSlices = slices.enter().append('path')
        .each(function(d) { this._current = Object.assign({}, d, { startAngle: d.endAngle }); })
        .attr('class', 'slice')
        .style('fill', function (d) { return color(joinKey(d)); });

      var t = d3.transition().duration(animationDuration);

      arc.innerRadius(innerRadius).outerRadius(outerRadius);

      oldSlices
        .transition(t)
          .attrTween('d', exitTween)
          .remove();

      var t2 = t.transition();
      slices
        .transition(t2)
          .attrTween('d', updateTween);

      var t3 = t2.transition();
      newSlices
        .transition(t3)
          .attrTween('d', updateTween);
    }

    pieChart.data = function (_) {
      return arguments.length ? (data = _, pieChart) : data;
    };

    pieChart.innerRadius = function (_) {
      return arguments.length ? (innerRadius = _, pieChart) : innerRadius;
    };

    pieChart.outerRadius = function (_) {
      return arguments.length ? (outerRadius = _, pieChart) : outerRadius;
    };

    return pieChart;
  }
//---------------------------------------------------------
export default {
  props: { values: Object},
  mounted() {
   
    var chart_obj = pieChart().outerRadius(outerRadius).innerRadius(innerRadius);
    var svg = d3.select('.js-chart').attr('width', width).attr('height', height);
    console.log(this.values);
    
    var domPieChart = svg.append('g')
    .attr('class', 'pie-chart')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .call(chart_obj.data(this.values.lower_partition));
    domPieChart.call(chart_obj.data(this.values.lower_partition));
  }
  
}
</script>
<style>
.cardGraph {
  width: 100%;
  height: 30rem;
  /* position: absolute; */
/*   z-index: 20; */
}
#tooltipTitle {
  padding: 0rem;
  text-align: center;
}

#tooltipTitle p {
  width: 100%;
  font-size: 13px;
  margin: 0px;
}


div.graphContainer {
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: #ffffff;
}

div .graphSvg {
  width: 100%;
  height: 100%;
}

.bar {
  fill: #4682B4;
}

text.valueText {
  font-size: 14px;
  fill: #ffffff;
}

path {
  stroke: gray;
}

line {
  stroke: gray;
}

line#limit {
  stroke: #FED966;
  stroke-width: 3;
  stroke-dasharray: 3 6;
}

.grid path {
  stroke-width: 0;
}

.grid .tick line {
  stroke: #9FAAAE;
  stroke-opacity: 0.3;
}

text.divergence {
  font-size: 12px;
  fill: #000000;
}

text.value {
  font-size: 14px;
}


text.label {
  font-size: 14px;
  font-weight: 400;
}

text.source {
  font-size: 10px;
}
</style>


