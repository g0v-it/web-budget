<template>
  <div class="cds-container">
    <div><svg class="chart js-chart pie-chart"></svg></div>
    <div class="cds-detail">
      <h3>{{name}}</h3>
      <h3>€{{amount}}</h3>
      <h2>{{percentage}} %</h2>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
//---------------------------------------------------------
//BUILDER
  let cdsSpeed=2000
  let width=400;
  let height=500;
  let outerRadius=180;
  let innerRadius=110;
  let currentElement=0;
  let slices;
  let intervalID;
  let updateDetail=function(context,overed_index){
    for (let index = 0; index < slices.length; index++) { 
        slices[index].classList.remove("selected")
      }
      console.log(overed_index)
      if(overed_index!=-1){
        currentElement=overed_index
      }
      slices[currentElement].classList.add("selected")
      context.amount=slices[currentElement].__data__.data.amount
      context.name=slices[currentElement].__data__.data.name
      currentElement=(currentElement+1)%slices.length;
  }
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

    function joinKey (d) {
      return d.data.name;
    }

    function pieChart (context) {
      
      var slices = context.selectAll('.slice').data(pie(data), joinKey);
      var newSlices = slices.enter().append('path')
        .each(function(d) { this._current = Object.assign({}, d, { startAngle: d.endAngle }); })
        .attr('class', 'slice')
        .style('fill', function (d) { return color(joinKey(d)); })
      var t = d3.transition().duration(animationDuration);

      arc.innerRadius(innerRadius).outerRadius(outerRadius);

      

      var t2 = t.transition();
      slices
        .transition(t2)
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
  data(){
    return {
      name:"",
      amount:"",
    }
  },
  computed:{
    percentage:function(){
      if (this.amount==undefined){
        return 0;
      }else{
        return this.amount*100/this.values.sum;
      }
    }
  },
  mounted() {
    let chart_obj = pieChart().outerRadius(outerRadius).innerRadius(innerRadius);
    let svg = d3.select('.js-chart').attr('width', width).attr('height', height);
    let domPieChart = svg.append('g')
    .attr('class', 'pie-chart')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .call(chart_obj.data(this.values.lower_partition));
    domPieChart.call(chart_obj.data(this.values.lower_partition));
    //UPDATE CDS DETAIL
    slices=d3.selectAll('.slice')._groups[0]
    d3.selectAll('.slice')
      .on('mouseenter',(actual,i)=>{
        window.clearInterval(intervalID)
        updateDetail(this,i)
      })
      .on('mouseleave',()=>{
        intervalID=window.setInterval(()=>{updateDetail(this,-1)}, cdsSpeed);
      });
    updateDetail(this,-1);
    intervalID=window.setInterval(()=>{updateDetail(this,-1)}, cdsSpeed);
  }
  
}
</script>
<style>
.selected{
  stroke-width: 3!important;
  opacity: 0.5;
}
.slice{
  stroke-width: 0.3;
}
.cds-container {
  margin: 0;
  padding: 1rem 1rem;
  min-height: 30rem;
  width: 100%;
  /* height: 100vh; */
  text-align: start;
  display: grid;
  /*   grid-gap: 1rem; */
  grid-row-gap: 2rem;
  grid-column-gap: 2rem;
  grid-template-columns: repeat(2, 1fr);
  pointer-events: all;
}
.pie-chart{
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: left;
}
.cds-detail{
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>


