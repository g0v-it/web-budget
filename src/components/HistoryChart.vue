<template>
    <div  class="cardGraph" id="contExt"  >
        <div class='graphContainer' id="contInt">
          <svg id="svgPlaceholder" class="graphSvg"></svg>
        </div>
      </div>
</template>
<script>
import * as d3 from "d3";
import numeral from "@/utils/numeralCustomizations";
import Configuration from "@/utils/configuration";
import { formatAmount, formatRate } from "@/utils/functions";

//---------------------------------------------------------
//BOUNDARIES
  let margin_top;
  let margin_left;
  let width;
  let height;
  let barSeparation;
  let animationDuration=1000;
  let min;
  let max;
  let data=[];
  let t;
  let svg;
  let chart;
  //---------------------------------------------------------
  //SCALE FUNCTIONS
  let xScale;
  let yScale;
  const optimize= function(input, meta){
    let output=[]
    Object.keys(input).forEach(element => {
      let y = element==='current' ? +meta.year : +element;
      output.push({year:y,value:parseFloat(input[element])/1000000.0})
    });
    return(output);    
   }

   const computeBoundaries= function(){
     let containerI = d3.select("#contInt")._groups[0][0]
     margin_top=20;
     margin_left=50;
     width=containerI.offsetWidth;//-2*margin_left;
     height=containerI.offsetHeight-2*margin_top;
    if(window.innerWidth< 900){
      console.log("PICCOLO")
      barSeparation=0.5      
    }else{
      barSeparation=0.5
    }
     
   }

  //----------------------------------------------------------
  export default {
    props: { values: Object, datasetMeta: Object},
    mounted() {
      data=optimize(this.values, this.datasetMeta)
      computeBoundaries()
      max = d3.max(data, function(d) { return parseFloat(d.value);} );
      min=0;
      max+=max*5/100;
      yScale = d3.scalePow().exponent(2).range([height, 0]).domain([min, max]);
      xScale = d3.scaleBand().range([0, width]).domain(data.map((s) => s.year)).padding(barSeparation)
  //----------------------------------------------------------
  //DROW GRAPHIC BOUNDLE
    
    t = d3.transition().duration(animationDuration);
    svg = d3.select('#svgPlaceholder');
    chart = svg.append('g').attr('transform', `translate(${margin_left}, ${margin_top})`);
    //ASSE X
    chart.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
    //ASSE Y
    chart.append('g').call(d3.axisLeft(yScale));
    //Y LINES
    chart.append('g').attr('class', 'grid').call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(''));
    //LABEL Y AXIS
    svg.append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin_top)
      .attr('y', margin_left*0.9)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Milioni €');
    //LABEL X AXIS
    /*
    svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('Anno');*/
    const barGroups = chart.selectAll()
      .data(data)
      .enter()
      .append('g');
    barGroups.append('rect')
      .attr('class', 'bar')
      .attr('x', (g) => xScale(g.year))
      .attr('y', (g) => yScale(min))
      .attr("height", 0)
      .attr('width', xScale.bandwidth())
      .on('mouseenter', function (actual, i) {
          d3.selectAll('.valueText')
            .attr('opacity', 0)
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.year) - 5)
            .attr('width', xScale.bandwidth() + 10)
          const y = yScale(actual.value)
          let line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)

          barGroups.append('text')
            .attr('x', (a) => xScale(a.year) + xScale.bandwidth() / 2)
            .attr('class', 'divergence')
            .attr('y', (a) => yScale(a.value) -30)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text((a, idx) => {
              const divergence = (actual.value - a.value)/a.value;
              let text = '';
              if (isFinite(divergence) && divergence.toFixed(0) > 0) text += '+';
              text += `${formatRate(divergence)}`
              return idx !== i ? text : '';
            })
      })
      .on('mouseleave', function () {
        d3.selectAll('.valueText')
          .attr('opacity', 1)
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => xScale(a.year))
          .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
      })
      .transition(t)
      .attr("height", (g) => (height - yScale(parseFloat(g.value))))
      .attr('y',(g)=>yScale(parseFloat(g.value)));
    //LABEL ON BAR
    barGroups
      .append('text').attr('class', 'valueText')
      .attr('x', (a) => xScale(a.year) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(min) - 10)
      .attr('text-anchor', 'middle')
      .text((a) => {
        formatAmount(a.value);
      })
      .transition(t).tween("text", function(d) {
        const v0 =0;//start
        const v1 = d.value;//target
        const i = d3.interpolateRound(v0, v1);

        return t => {this.textContent = formatAmount(i(t))};
      });
  },
};
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

text.valueText {
  font-size: 14px;
  fill: #ffffff
}


text.label {
  font-size: 14px;
  font-weight: 400;
}

text.source {
  font-size: 10px;
}

@media screen and (max-width: 900px) {
    text.valueText {
    font-size: 12px;
    fill: #ffffff
  }
}
</style>