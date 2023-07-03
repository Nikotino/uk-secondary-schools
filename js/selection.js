var dropdowns={"income_value":["", 'median_wage', 'mean_wage', 'wage_gap'], "crime_rate":["", 'crime_ratio_2021', 'violence_ratio_2021', 'theft_ratio_2021']}
var value_color;
var map_colors=["red", "yellow", "green"]
var criteria;

d3.keys(dropdowns).forEach(function(x)
    {
          console.log("x", x, dropdowns[x])
        d3.select("#"+x)
      .selectAll('myOptions')
     	.data(dropdowns[x]).enter().append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button;
    
});


