
var thresholds=[500, 400, 300, 200, 100]

var rect_colors=["#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"]
var currentOpacity = 1.0;
var filters={"rank":[], "type":[], "gender":[], "boarding":[], 'day_fee':[]}
var markers_selected;

/////Rank
add_criteria(criteria="rank",  options=thresholds, placeholder="#choose_rank_rect",  button_width=30, button_height=20, viewBox_size="250 50", add_to_filter="values")

window["ranksvg"].append("text")
.text("Top:")
.attr("x", 18).attr("y", 29)
.attr("font-family", "Arial")
.attr("font-size", "12px")

window["rankenter"].selectAll("rect").attr("y", 15)
.attr("class", "rect_rank")  

window["rankenter"].selectAll("rect")
      .style("fill", function(d, i) 
      {return rect_colors[this.id.split("_").slice(-1)]})
      
window["rankenter"].selectAll("text").attr("y", 29).attr("font-size", "10px") .style("fill", function (d,i) {if(i==4){return "white"} else {return "black"}})
d3.select("#text_rank_4").style("fill", "white")


/////Gender
add_criteria(criteria="gender",  options={"boys":'Boys', "girls":'Girls', "mixed":'Mixed', "sixth_form":'Mixed'}, placeholder="#choose_gender_rect",  button_width=55, button_height=30, viewBox_size="250 50", add_to_filter="keys")

//// Adjust last button text

d3.select("#text_gender_3").attr("y", 25)

window["genderenter"].append("text")
.attr("class", "button_text")
.attr("x", d3.select("#text_gender_3").attr("x"))
.attr("y", 37)  
.html( "6th form")
.attr("dx", function(d,i) {
        var thisWidth = this.getComputedTextLength()
        return -thisWidth/2
        
    })
.attr('pointer-events', 'none')

/////School type
add_criteria(criteria="type",  options=["Private", "State"], placeholder="#choose_type_rect",  button_width=60, button_height=25, viewBox_size="250 50", add_to_filter="values")
window["typeenter"].selectAll("text").attr("y", 27)


/////Boarding
add_criteria(criteria="boarding",  options={"boarding":'Boarding', "day":'Day'}, placeholder="#choose_boarding_rect",  button_width=60, button_height=25, viewBox_size="250 50", add_to_filter="keys")
window["boardingenter"].selectAll("text").attr("y", 27)

/////////////////////////Functions/////////////////////////////////////////////////////////////////////////////////

////Fee

d3.select("#choose_fee_range")


var feesvg = d3.select("#choose_fee_range")
  .classed("svg-container", true) 
  .style("padding-bottom", "30%")
			.append("svg")
 .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 250 70")
   .classed("svg-content-responsive", true)
   .append("g")
   .attr('transform', 'translate(25,25)')

var sliderFee = d3
    .sliderBottom()
    .min(0)
    .max(45)
    .step(5)
    .width(200)
//    .tickValues(month)
    .default([0, 45])
        .handle(
        d3.symbol()
          .type(d3.symbolCircle)
          .size(100)
      )
      .fill("green")
    .on('onchange', function() { 
      filters['day_fee']=sliderFee.value()
      filter_values(filters)
   
    markers.map(m=> m.remove())
    markers_selected.map(m => m.addTo(map))
    });
    
 feesvg.call(sliderFee);
 
//  feesvg.append("text")
// .text("Annual, K£:")
// .attr("x", 10).attr("y", 29)
// .attr("font-family", "Arial")
// .attr("font-size", "12px")
    
////add criteria to the left menu
function add_criteria(criteria, options, placeholder, button_width, button_height, viewBox_size, add_to_filter)

{

var start_t=125-d3.keys(options).length/2*button_width

window[criteria+"svg"]=d3.select(placeholder)
  .classed("svg-container", true) 
			.append("svg")
 .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 " +  viewBox_size)
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
   .append("g")
   
   

window[criteria+"enter"]=eval(window[criteria+"svg"])
      .selectAll("rect")
      .data(d3.keys(options))
      .enter()
      .append("g")
      
eval(window[criteria+"enter"])
      .append("rect")
      .attr("class", "rect_button")  
      .style("fill", "white")
      .attr("x", function(d, i) {return start_t+i*button_width})
      .attr("y", 10)
          .attr("height", button_height)    
    .attr("width", button_width)
    .attr("id", (d,i) => "rect_"+criteria+"_"+i)
    
eval(window[criteria+"enter"])
.append("text")
.attr("class", "button_text")
.attr("x", function(d, i) {return start_t+button_width/2+i*button_width})
      .attr("y", 30)  
  .html(d=>options[d])

.attr("dx", function(d,i) {
        var thisWidth = this.getComputedTextLength()
        return -thisWidth/2
        
    })
    .attr('pointer-events', 'none')
       .attr("id", (d,i) => "text_"+criteria+"_"+i)
       
//add second line "6th form"

eval(window[criteria+"enter"]).on("click", function(d)
{
    if (criteria=="rank")
    {
        currentBorder = d3.select(this).select("rect").style("stroke")=="black" ? "none" : "black";
        d3.select(this).select("rect").style("stroke", currentBorder)
    }
    else
    {
    currentFill = d3.select(this).select("rect").style("fill")=="white" ? "#bfbfbf" : "white";
    d3.select(this).select("rect").style("fill", currentFill)    
    }

    if (add_to_filter=="values")
        {filters[criteria]=filters[criteria].includes(options[d])? filters[criteria].filter(x => x!=options[d]) : filters[criteria].concat(options[d])}
    else
        {filters[criteria]=filters[criteria].includes(d)? filters[criteria].filter(x => x!=d) : filters[criteria].concat(d)}
        
    filter_values(filters)
    markers.map(m=> m.remove())
    markers_selected.map(m => m.addTo(map))
    
})
}


/////////////////////filter function

function filter_values(filters)
{
    markers_selected=markers;
    markers_selected_rank=[];
    markers_selected_gender=[];
    markers_selected_type=[];
    markers_selected_boarding=[];
    
    if(filters['rank'].length>0)
    {
        for (i in filters['rank'])
        {markers_selected_rank=markers_selected_rank.concat(markers_selected.filter(m=> (m.options.rank>=filters['rank'][i]-100)&(m.options.rank<filters['rank'][i])))}
        
        markers_selected=markers_selected_rank    
    }

    if(filters['gender'].length>0)
    {
        for (i in filters['gender'])
         {markers_selected_gender=markers_selected_gender.concat(markers_selected.filter(m=> (m.options[filters['gender'][i]]==1)))}
         
        markers_selected=markers_selected_gender        
        
        
    }

     if(filters['type'].length>0)
     {          for (i in filters['type'])
         {markers_selected_type=markers_selected_type.concat(markers_selected.filter(m=> (m.options.type==filters['type'][i])))}
     markers_selected=markers_selected_type
     }
     
         if(filters['boarding'].length>0)
    {
        for (i in filters['boarding'])
         {markers_selected_boarding=markers_selected_boarding.concat(markers_selected.filter(m=> (m.options[filters['boarding'][i]]==1)))}
         
        markers_selected=markers_selected_boarding       
        
        
    }
    
         if(filters['day_fee'].length>0)
    {
    
     markers_selected=markers_selected.filter(m=> (m.options.day_fee/1000>=sliderFee.value()[0])&&(m.options.day_fee/1000<=sliderFee.value()[1]))
    }
}



////////add counties info

///crime rates

///rent

///median wage