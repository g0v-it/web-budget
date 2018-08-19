//TODO: classe BubbleGraphController da migliorare
import * as d3 from 'd3';

class BubbleGraphController {
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

        this.fillColor = this.calcFillColor([minAmount, maxAmount], ["#c6dbef", "#08500c"]);

            // Use map() to convert raw data into node data.
            // Checkout http://learnjsdata.com/ for more on
            // working with data.
            ;
        let myNodes = rawData.map((d) => {

            return {
                id: d.code,
                radius: radiusScale(+d.amount),
                value: +d.amount,
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
        this.bubbles = this.bubbles.merge(bubblesE);

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