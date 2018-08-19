//TODO: classe BubbleGraphController da migliorare
import * as d3 from 'd3';
    let width;
    let height;
    let simulation;
    let velocityDecay=0.2;
    let forceStrenght=0.03;
    let center;
    let group_centers;
    let bubbles;
    let nodes;
    let svg;
    let chart;
/*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    // console.log("TICK TICK");
     bubbles
       .attr('cx', function (d) { 
      //   console.log(d.x)
         return d.x; })
       .attr('cy', function (d) {
      //   console.log(d.y)
         return d.y; });
   }
/*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    let maxAmount = d3.max(rawData, function (d) { return +d.amount; });
    let minAmount = d3.min(rawData, function (d) { return +d.amount; });
    // Sizes bubbles based on .
    let radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([5, 80])
      .domain([minAmount, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    let myNodes = rawData.map(function (d) {
      return {
        id: d.code,
        radius: radiusScale(+d.amount),
        value: d.amount-d.last_amount,
        //name: d.grant_title,
        //org: d.organization,
        /*group1: d.group1,
        centerGroup1:{
          x:centers_2.find(function(el){return el.value==d.group1}).x,
          y:centers_2.find(function(el){return el.value==d.group1}).y
        },
        group2: d.group2,
        centerGroup2:{
          x:centers_1.find(function(el){return el.value==d.group2}).x,
          y:centers_1.find(function(el){return el.value==d.group2}).y
        },*/
        group:[
            //{x: posizione del centro secondo il criterio di raggruppamento0
            //y:
            //v:}
            //...
         ],
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.radius - a.radius; });
    console.log(myNodes)
    return myNodes;
  }

/* Charge function that is called for each node.
   As part of the ManyBody force.
   This is what creates the repulsion between nodes.
  
   Charge is proportional to the diameter of the
   circle (which is stored in the radius attribute
   of the circle's associated data.
  
   This is done to allow for accurate collision
   detection with nodes of different sizes.
  
   Charge is negative because we want nodes to repel.
   @v4 Before the charge was a stand-alone attribute
    of the force layout. Now we can use it as a separate force!*/
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

 /* Nice looking colors - no reason to buck the trend
    @v4 scales now have a flattened naming scheme*/
    let fillColor = d3.scalePow()
    .exponent(0.5)
    .domain([-2566300000, 6501500000])
    .range(['#FFA500','#3bc62b']);

 //VISIBILI DALL ESTERNO
/*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));
    simulation.force('y', d3.forceY().strength(forceStrength).y(center.y));

    // @v4 We can reset the alpha value and restart the simulation
      simulation.alpha(1).restart();
  }

/*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * yearCenter of their data's year.
   */
  function splitBubbles(group_cat_id) {
    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(function(d){
      //return d.group[group_cat_id].x;
    }));
    simulation.force('y', d3.forceY().strength(forceStrength).y(function(d){
      //return d.group[group_cat_id].y;
    }));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

/*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  function chart(selector, rawData,width_p,height_p,group_data) {
    //define how you can group the balls
    group_centers=group_data;
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector with desired size.
    width=width_p;
    height=height_p;
    //center={x:,y:}
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.value); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.value)).darker(); })
      .attr('stroke-width', 2);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

       simulation.nodes(nodes)
    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!

    // Set initial layout to single group.
    groupBubbles();
  };


/*class BubbleGraphController {
    constructor(selector) {
        this.selector = selector;
        this.nodes = [];
        this.bubbles = null;
        this.svg = null;
        this.forceStrenght = 0.03;
        this.height = null;
        this.width = null;
        this.center = null;
        this.fillColor = null;
    }

    setBoundaries = (width, height) => {
        this.height = height;
        this.width = width;
        this.center = { x: width / 2, y: height / 2 };
    }

    ticked = () => {
        this.bubbles
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
    }

    charge = (d) => {
        return -Math.pow(d.radius, 2.0) * 0.03;
    }

    calcFillColor = (domain, range) => {
        return d3.scalePow().exponent(0.5).domain(domain).range(range);
    }

    createNodes = (rawData) => {

        // Use the max amount in the data as the max in the scale's domain
        // note we have to ensure the amount is a number.
        const maxAmount = d3.max(rawData, function (d) { return +d.amount; });
        const minAmount = d3.min(rawData, function (d) { return +d.amount; });

        // Sizes bubbles based on area.
        // @v4: new flattened scale names.
        let radiusScale = d3.scalePow()
            .exponent(0.4)
            .range([5, 80])
            .domain([minAmount, maxAmount]);

        this.fillColor = this.calcFillColor([minAmount, maxAmount], ["#2962ff", "#00c853"]);

        // Use map() to convert raw data into node data.
        // Checkout http://learnjsdata.com/ for more on
        // working with data.
        ;
        let myNodes = rawData.map((d) => {

            return {
                id: d.code,
                radius: radiusScale(+d.amount),
                value: +d.amount,
                diff: d.amount - d.last_amount,
                nome: d.group2,
                x: Math.random() * this.width,
                y: Math.random() * this.height
            };
        });

        // sort them to prevent occlusion of smaller nodes.
        myNodes.sort(function (a, b) { return b.value - a.value; });

        this.nodes = myNodes;
    }

    startSimulation = () => {
        // Create a SVG element inside the provided selector
        // with desired size.
        this.svg = d3.select(this.selector)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Bind nodes data to what will become DOM elements to represent them.
        this.bubbles = this.svg.selectAll('.bubble')
            .data(this.nodes, function (d) { return d.id; });
        // Create new circle elements each with class `bubble`.
        // There will be one circle.bubble for each object in the nodes array.
        // Initially, their radius (r attribute) will be 0.
        // @v4 Selections are immutable, so lets capture the
        //  enter selection to apply our transtition to below.
        let bubblesE = this.bubbles.enter().append('circle')
            .classed('bubble', true)
            .attr('r', 0)
            .attr('fill', (d) => { return this.fillColor(d.value); })
            .attr('stroke', (d) => { return d3.rgb(this.fillColor(d.value)).darker(); })
            .attr('stroke-width', 2)
            .on('click', function (d) { console.log(d) });
        /*         .on('mouseover', showDetail)
                .on('mouseout', hideDetail); */

        // @v4 Merge the original empty selection and the enter selection
       /* this.bubbles = this.bubbles.merge(bubblesE);

        this.bubbles.transition()
            .duration(2000)
            .attr('r', function (d) { return d.radius; });

        let forceStrenght = this.forceStrenght;

        this.simulation = d3.forceSimulation()
            .velocityDecay(0.2)
            .nodes(this.nodes)
            .force('x', d3.forceX().strength(forceStrenght).x(this.center.x))
            .force('y', d3.forceY().strength(forceStrenght).y(this.center.y))
            .force('charge', d3.forceManyBody().strength(this.charge))
            .on('tick', this.ticked);
    }

}

export default BubbleGraphController;