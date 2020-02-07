// // @TODO: YOUR CODE HERE!

function makeResponsive() {

var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
    
    // parse data
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.state = +data.state;      
    });

    // Create x scale function
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.poverty)-1, d3.max(data, d => d.poverty)])
    .range([0, width]);

    // Create x scale function
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.healthcare)-1, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
    .call(leftAxis);

    // append initial circles + formatting
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "green")
    .attr("opacity", "0.7");

    var abbrGroup = chartGroup.selectAll("label")
    .data(data)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("font-size",9.5)
    .attr("font-weight","bold")
    .attr("fill", "black")
    .attr("x", d => xLinearScale(d.poverty)-6)
    .attr("y", d => yLinearScale(d.healthcare)+6);
   
     // create axes labels
     chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left + 40)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Lacks Healthcare (%)");
 
     chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
     .attr("class", "axisText")
     .text("In Poverty (%)");

    }).catch(function(error) {
        console.log(error);
  });

}

  makeResponsive();

  d3.select(window).on("resize", makeResponsive);