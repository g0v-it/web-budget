<template>
    <div  class="cardGraph"  >
        <div class='graphContainer'>
          <svg id="svgPlaceholder" class="graphSvg"></svg>
        </div>
      </div>
</template>
<script>
import * as d3 from "d3";
//---------------------------------------------------------
//BOUNDARIES
    let margin = 80;
    let width = 500-2*margin;
    let height = 420 - 2 * margin;
    let barSeparation=0.4;
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
    const optimize= function(input){
      let output=[]
      Object.keys(input).forEach(element => {
      output.push({year:element,value:parseFloat(input[element])/1000000000})
      });
      console.log(output);
      return(output);
      
    }
  //----------------------------------------------------------
export default {
  props: {
      values: Object
  },
  watch: {
    values(newVal, oldVal) {
      if(newVal!={}){
        data=optimize(this.values)
        max = d3.max(data, function(d) { return parseFloat(d.value);} );
        max+=max*5/100
        min = d3.min(data, function(d) { return parseFloat(d.value);} );
        min-= min/5*100
        yScale = d3.scalePow().exponent(1).range([height, 0]).domain([0, max]);
        xScale = d3.scaleBand().range([0, width]).domain(data.map((s) => s.year)).padding(barSeparation)
          //----------------------------------------------------------
    //DROW GRAPHIC BOUNDLE
    
    t = d3.transition().duration(animationDuration);
    svg = d3.select('#svgPlaceholder');
    chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
    //ASSE X
    chart.append('g').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
    //ASSE Y
    chart.append('g').call(d3.axisLeft(yScale));
    //Y LINES
    chart.append('g').attr('class', 'grid').call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(''));
    //LABEL X AXIS
    svg.append('text')
      .attr('class', 'label')
      .attr('x', -(height / 2) - margin)
      .attr('y', margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Bilions');
    //LABEL Y AXIS
     svg.append('text')
      .attr('class', 'label')
      .attr('x', width / 2 + margin)
      .attr('y', height + margin * 1.7)
      .attr('text-anchor', 'middle')
      .text('year');
        const barGroups = chart.selectAll()
        .data(data)
        .enter()
        .append('g')
        
        barGroups.append('rect')
          .attr('class', 'bar')
          .attr('x', (g) => xScale(parseInt(g.year)))
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
              const divergence = (a.value - actual.value).toFixed(1)
              let text = ''
              if (divergence > 0) text += '+'
              text += `${divergence}%`
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
      .attr('y', (a) => yScale(0) - 10)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.value}%`)
      .transition(t).tween("text", function(d) {
        const v0 =0;//start
        const v1 = d.value;//target
        const i = d3.interpolateRound(v0, v1);
        
        return t => {this.textContent = i(t)};
      }); 
      }
    }
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


