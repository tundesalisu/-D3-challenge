// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartwidth = svgWidth - chartMargin.left - chartMargin.right;
var chartheight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  d3.csv("data.csv").then(function(content){

    
    console.log(content);

    content.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

      var xLinearScale = d3.scaleLinear()
                            .domain(d3.extent(content, d => d.poverty))
                            .range([0, chartwidth]);

    var yLinearScale = d3.scaleLinear()
                                .domain(d3.extent(content, d => d.healthcare))
                                .range([chartheight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .call(leftAxis);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartheight})`)
    .call(bottomAxis);

    var circles = chartGroup.selectAll("circle")
      .data(content)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.healthcare))
      .attr("cy", d => yLinearScale(d.poverty))
      .attr("r", 20)
      .attr("fill", "gold")
      .attr("opacity", ".7");

      var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<strong> HealthCare: ${d.healthcare}<strong><hr><br><strong>Poverty: ${d.poverty}<strong><hr>`);
        });
       
       chartGroup.call(toolTip);

       circles.call(toolTip);

       circles.on("mouseover", function(content) {
        toolTip.show(content,this);
        })
        .on("mouseout", function(content, index) {
            toolTip.hide(content);
        });
    

  


  })