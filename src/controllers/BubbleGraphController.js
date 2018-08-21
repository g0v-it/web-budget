//TODO: classe BubbleGraphController da migliorare
import * as d3 from 'd3';
let width;
let height;
let simulation;
const velocityDecay = 0.2;
const forceStrength = 0.03;
let center;
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
            return d.x;
        })
        .attr('cy', function (d) {
            //   console.log(d.y)
            return d.y;
        });
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
        .range([3, 90])
        .domain([minAmount, maxAmount]);



    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    let myNodes = rawData.map(function (d) {

        return {
            id: d.code,
            radius: radiusScale(+d.amount),
            value: d.amount - d.last_amount,
            diff: ((d.amount - d.last_amount) / d.amount) * 100,
            partitions: d.partition,
            tags: d.tags,
            x: Math.random() * 900,
            y: Math.random() * 900
        };
    });
    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.radius - a.radius; });
    //console.log(myNodes)
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
let fillColor = (val) => {
    let color = '#D84B2A';
    let bubbleHeight = 5;
    if (val > -25) {
        color = '#EE9586';
    }
    if (val > -5) {
        color = '#E4B7B2';
    }
    if (val > 0) {
        color = '#BECCAE';
    }
    if (val > 5) {
        color = '#9CAF84';
    }
    if (val > 25) {
        color = '#7AA25C';
    }
    return color;

}

//VISIBILI DALL ESTERNO
/*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
export function groupBubbles() {
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
export function splitBubbles(group_cat_id) {
    //assign center to bubble

    for (let i = 0; i < nodes.length; ++i) {
        let center = group_cat_id.labels.find(function (el) {
            return el.value == nodes[i].partitions[group_cat_id.partition]
        })
        nodes[i].group_center = { x: center.x, y: center.y }
    }

    simulation.force('x', d3.forceX().strength(forceStrength).x(function (d) {
        return d.group_center.x;
    }));
    simulation.force('y', d3.forceY().strength(forceStrength).y(function (d) {
        return d.group_center.y;
    }));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
}


export function chart( rawData, width_p, height_p) {
    width = width_p;
    height = height_p;
    // convert raw data into nodes data
    nodes = createNodes(rawData);



    center = {
        x: width / 2,
        y: height / 2
    }
    
    svg = d3.select('svg');
    console.log(svg.attr('width'))
    /* center = {
        x: svg.attr('width') / 2,
        y: svg.attr('height') / 2
    } */

    bubbles = svg.selectAll('circle')
        .data(nodes)
        .attr('r', 0)
        .attr('fill', function (d) { return fillColor(d.diff); })
        .attr('stroke', function (d) { return d3.rgb(fillColor(d.diff)).darker(); })
        .attr('stroke-width', 1)
        .attr('pointer-events', 'all');
   /*      .on('click', function (d) { console.log(d) }); */
   
    bubbles.transition()
        .duration(2000)
        .attr('r', function (d) { return d.radius; });

    simulation = d3.forceSimulation()
        .velocityDecay(velocityDecay)
        .nodes(nodes)
        .force('charge', d3.forceManyBody().strength(charge))
        .on('tick', ticked).stop();

    groupBubbles();
};


