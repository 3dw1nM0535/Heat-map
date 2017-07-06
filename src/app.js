var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// load json data
d3.json(url, function(error, data) {
  var baseTemp = data.baseTemperature;
  var dataset = data.monthlyVariance;

  var margin = {
      top: 0,
      right: 50,
      bottom: 130,
      left: 110
    },
    padding = {
      top: 0,
      right: 0,
      bottom: 75,
      left: 75
    },
    outerWidth = 1200,
    outerHeight = 550,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom,
    middle = (width + margin.right - margin.left) / 2;

  //Create svg element
  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // format months TODO

  //Create scale functions
  var xScale = d3.scaleLinear()
    .domain([1753, 2015])
    .range([0, width]);

  var yScale = d3.scaleTime()
    .domain([12, 1])
    .range([height, height / 12]);
  
  var minVar = d3.min(dataset, function(d) { return d.variance; });
  var maxVar = d3.max(dataset, function(d) { return d.variance; });
  
  // color scheme from: https://bl.ocks.org/mbostock/5577023
  var spectral = ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]
  spectral.reverse();
  
  var zScale = d3.scaleQuantile()
    .domain([minVar, maxVar])
    .range(spectral);
  
  var colorToValue = function(color) { return zScale.invertExtent(color)[0] }; // returns degrees variance for corresponding color
  
  // convert number to corresponding month
  var formatTime = d3.timeFormat("%B");
  var formatMonth = function(month) {
    return formatTime(new Date(2012, month - 1))
  };
  
  //Define X axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(20)
    .tickFormat(d3.format(""));

  //Define Y axis
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .tickFormat(formatMonth);
  
  //Create bars
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return xScale(d.year);
    })
    .attr("y", function(d) {
      return yScale(d.month);
    })
    .attr("width", function(d) {
      return innerWidth / (2015 - 1753);
    })
    .attr("height", function(d) {
      return height / 12;
    })
    .attr("fill", function(d) {
      return zScale(d.variance);
    })
    .on("mouseover", function(d) {
      d3.select(this)
      var formatNum = d3.format(".2f")
      var toolTip = d3.select("#tooltip")

      var x = d3.event.x;
      var y = d3.event.y;
    
      // toolTip.style("color", zScale(d.variance));

      toolTip.style("left", x + 20 + "px")
        .style("top", y - 35 + "px");

      toolTip.select("#year")
        .text(d.year);

      toolTip.select("#month")
        .text(formatMonth(d.month));

      toolTip.select("#variance")
        .text(formatNum(d.variance) + "℃");
    
     toolTip.select("#avg")
      .text(formatNum(8.66 + d.variance) + "℃");

      toolTip.classed("hidden", false);
    }).on("mouseout", function(d) {
      // hide the tooltip
      d3.select("#tooltip").classed("hidden", true);
    });

  //Create X axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height + height / 12) + ")")
    .call(xAxis);

  //Create Y axis
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0," + (height / 24) + ")")
    .call(yAxis);
  
    //append axis labels & headings
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", -padding.left)
    .attr("x", - height / 2)
    .attr("transform", "rotate(-90)")
    .text("Months");

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", middle)
    .attr("y", height + padding.bottom)
    .text("Years");
  
  //Create legend
  var legendElementWidth = 35;
  var legendElementHeight = 20;
  
  var legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width - legendElementWidth * spectral.length) + "," + 0 + ")");
  
  legend.selectAll('rect')
      .data(spectral)
      .enter()
      .append("rect")
      .attr("y", height + padding.bottom)
      .attr("x", function(d, i){ return i *  legendElementWidth;})
      .attr("width", legendElementWidth)
      .attr("height", legendElementHeight)
      .style("fill", function(d) {
         return d;
      });
  var rounded = function(number) {
    return Math.round( number * 10 ) / 10;
  } 
  var formatNum = d3.format(".1f")
  // append scale for legend
  legend.selectAll('text')
      .data(spectral)
      .enter()
      .append("text")
      .text( function(d) { return formatNum(rounded(colorToValue(d) + baseTemp))})
      .attr("text-anchor", "middle")
      .attr("y", height + padding.bottom + legendElementHeight + 14)
      .attr("x", function(d, i){ return i *  legendElementWidth + legendElementWidth / 2;})
  
});