var counties;
var counties_filtered;
var geojson;
var value_color;
var map_colors=["red", "yellow", "green"];
var uklayer;
var domain_values;
var school_position;
var markers_data;
var icon_Url;
var markers;
var info={"school_name": "school", "website": "website", "address": "address", "school_type":"type", "school_rank":"rank", "A_LEVEL":"A_LEVEL_1", "GCSE":"GCSE", 
"school_gender_age":"gender_age", "day_fee":"fee", "boarding_fee":"boarding_fee"}
var county_criteria;
var popup_info;

var dataLayerGroup;

var filterval = 200;

var colorFilter;
//access data

// mapid is the id of the div where the map will appear
var map = L
  .map('uk_map')
  .setView([54, -2], 6);   // center position + zoom


// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 16,
    }).addTo(map);

   
///search 

L.Control.geocoder({
    position: 'topleft',
    defaultMarkGeocode: false
  })
  .on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest()
    ])
    map.fitBounds(poly.getBounds());
  }).addTo(map)
  
// Add a svg layer to the map
L.svg().addTo(map);

var popup = L.popup();

function style(feature) {
    return {
        fillColor: "lightgrey",
        fillOpacity: 0.4,
        color: "dimgrey",
        weight: 1
        
    };
}


function onMapClick(e, county_criteria) {
    
    var info = e.target.feature.properties;
    
    if(popup_info)
    { popup
        .setLatLng(e.latlng)
        .setContent(info.NAME_1+": "+info.NAME_2+"; "+d3.format(".1f")(info[popup_info]))
        .openOn(map);}
        
        else
        {popup
        .setLatLng(e.latlng)
        .setContent(info.NAME_1+": "+info.NAME_2)
        .openOn(map);}
        
console.log("criteria", popup_info)
console.log("info", info)
}


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        fillOpacity: 0.7
    });

    layer.bringToFront();
}

function resetHighlight(e) {
        var layer = e.target;

    layer.setStyle({
        weight: 1,
        fillOpacity: 0.4
    });
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onMapClick
    });
}

school_icon_2 = new L.Icon(
     {
    iconUrl: 'icons/icon-2.png',
  iconSize: [15, 22],
  iconAnchor: [6, 22],
  popupAnchor: [1, -20]  
         
     })

school_icon_3 = new L.Icon(
     {
    iconUrl: 'icons/icon-3.png',
  iconSize: [15, 22],
  iconAnchor: [6, 22],
  popupAnchor: [1, -20]  
         
     })
    
school_icon_4 = new L.Icon(
     {
    iconUrl: 'icons/icon-4.png',
  iconSize: [15, 22],
  iconAnchor: [6, 22],
  popupAnchor: [1, -20]  
         
     })


school_icon_5 = new L.Icon(
     {
    iconUrl: 'icons/icon-5.png',
  iconSize: [15, 22],
  iconAnchor: [6, 22],
  popupAnchor: [1, -20]  
         
     })
     
school_icon_6 = new L.Icon(
     {
    iconUrl: 'icons/icon-6.png',
  iconSize: [15, 22],
  iconAnchor: [6, 22],
  popupAnchor: [1, -20]  
         
     })


///////// 

d3.csv('data/top_schools_upd.csv')
  .then(data => {
 
   markers=data.map(d=> L.marker([d.long, d.lat], {type: d.Type, rank:d.RANK, boys:d.boys, girls:d.girls, mixed:d.mixed, sixth_form:d["6_form"], day_fee:d.annual_fee, boarding:d.boarding, day:d.day, school:d.SCHOOL, address:d.address_revised,
       A_LEVEL:d.A_LEVEL, A_LEVEL_1:d.A_LEVEL_1, A_LEVEL_2:d.A_LEVEL_2, GCSE:d.GCSE, GCSE_1:d.GCSE_1, gender_age:d.gender_age, students_num:d.students_n, website:d.website, fee:d.fee, boarding_fee:d.boarding_fee

   }).bindPopup(d.SCHOOL+"; "+d.TOWN+": "+d.RANK))
  
   markers.filter(d=>d.options.rank>=400).map(d=> d.setIcon(school_icon_2))
    markers.filter(d=> (d.options.rank>=300)&&(d.options.rank<400)).map(d=> d.setIcon(school_icon_3))
    markers.filter(d=>(d.options.rank>=200)&&(d.options.rank<300)).map(d=> d.setIcon(school_icon_4))
    markers.filter(d=>(d.options.rank>=100)&&(d.options.rank<200)).map(d=> d.setIcon(school_icon_5))
    markers.filter(d=>(d.options.rank>=0)&&(d.options.rank<100)).map(d=> d.setIcon(school_icon_6))
    
    markers.map(d=> d.addTo(map));

// add information on each school into infopanel
 markers.map(d=> d.on("mouseover", function(x) {
     d3.select("#infopanel_all").style("display", "block")
     
for (item in info)
{  d3.select("#"+item).selectAll("text").remove()
    
    d3.select("#"+item)
    .append("text")
.html(function(){ return x.target.options[info[item]]})
.attr("font-family", "Arial")
.attr("font-size", "12px")
}

var link=x.target.options.website
if(!link.includes("http")){link="https://"+x.target.options.website}
d3.select("#website").on("click", function() { window.open(link); })

if (x.target.options.fee=="")
{d3.select("#fee_heading").style("display", "none")} else {d3.select("#fee_heading").style("display", "block")}

}))
}
)

//     array=markers.map(d=>d.options.day_fee).filter(d=> d!=0)
//   for (q in  [0.2, 0.4, 0.6, 0.8, 1]) {console.log(q, d3.quantile(array, q))}
   
////legend place

d3.select("#map_legend_heading").append("text").attr("x", 10).attr("y", 10).style("font-size", "12px").html("")

var legend_svg=d3.select("#map_legend_body")
  .classed("svg-container", true) 
   .style("padding-bottom", "800%")
			.append("svg")
 .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 80 250")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
   .append("g")
   .style("padding-bottom", "20%")
   
legend_enter=legend_svg
      .selectAll("rect")
      .data(d3.range(10))
      .enter()
      .append("g")
      
legend_enter
      .append("rect")
//      .style("fill", function(d, i) {return value_color(legend_values[i])})
    .style("fill","lightgrey")
      .style("opacity", 0.8)
      .attr("x", 10)
      .attr("y", function(d, i) {return 25+i*20})
      .attr("width", 15)
    .attr("height", 20)
    
    
var ticks=legend_enter.append("g").attr("transform", function(d, i) {return "translate(10,"+(35+20*i)+")"})

ticks
.append("text")
.attr("x", 27)
.attr("dy", "0.5em")
//  .html((d, i)=>legend_values[i])
   .html("")
  .style("font-size", 10)

ticks
.append("line")
.attr("x1", 10)
.attr("x2", 25) 
.style("stroke", "lightgrey")
.style("stroke-width", "0.5")

// layerControl.addBaseLayer(satellite, "Satellite");

d3.json('data/uk-counties.json')
  .then(topology => {
    
counties= topology.objects.GBR_adm2.geometries

feature=topojson.feature(topology, topology.objects.GBR_adm2)
            .features
            
d3.csv('data/counties_data/crime_data_2021.csv') .then(counties_data => 
    
{
    counties_data=d3.map(counties_data, d=>d.county)
    
    console.log("counties_data", counties_data)
    info_values=["crime_rate", "rent", "median_wage"]
   
    //ratio_2021
    counties.map(function(d)
    {
    
    for (k in info_values)
    { try
    {d['properties'][info_values[k]]=counties_data.get(d['properties']['NAME_2'])[info_values[k]]}
        catch (err) {} 
    }
        
  })
})
 

uklayer=L.geoJSON(feature, {style: style, onEachFeature: onEachFeature}).addTo(map);

})


////define map color
function path_color(y) {if (y!="") {return value_color (y)} else {return "lightgrey"}};

function update_map(county_criteria, order)
                    
                    {
d3.select("#counties_info").selectAll("p").style("color", "black")
d3.select("#"+county_criteria).select("p").style("color", "blue")

popup_info=county_criteria;  //to be used in map popup 
                     
if (order=="asc") {map_colors=["red", "yellow", "green"]}
else if (order=="desc") {map_colors=["green", "yellow", "red"]}
    
////define map color

counties_filtered=counties.filter(d=>d['properties'][county_criteria]!="")
values_filtered=counties_filtered.map(x=>parseFloat(x.properties[county_criteria]))

domain_values=[d3.min(values_filtered), d3.median(values_filtered), d3.max(values_filtered)]
            
value_color =
    d3.scaleLinear()
.domain(domain_values)
.range(map_colors);

uklayer.eachLayer(function(layer) {
       var value= layer.feature.properties[county_criteria];
       
        layer.setStyle({
            fillColor: path_color(value),
        fillOpacity: 0.6,
        color: "dimgrey",
        weight: 1
        });
    });


/////////////////////legend
d3.select("#map_legend_heading").selectAll("text").html(d3.select("#"+county_criteria).text())

///create legend_values - linear from min to max

legend_values=d3.range(5).map(i=>Math.round((d3.min(values_filtered)+(d3.median(values_filtered)-d3.min(values_filtered))*i/5)/50)*50)
legend_values=legend_values.concat(d3.range(5).map(i=>Math.round((d3.median(values_filtered)+(d3.max(values_filtered)-d3.median(values_filtered))*i/5)/50)*50)) 
legend_values=legend_values.reverse()


d3.select("#map_legend").style("display", "block")

legend_svg
      .selectAll("rect")
     .style("fill", (d, i)=> value_color(legend_values[i]))
    
legend_svg
.selectAll("text")
.html((d, i)=>legend_values[i])

}////update map

function clear_map()
{
    
    uklayer.eachLayer(function(layer) {
       var value= layer.feature.properties[county_criteria];
       
        layer.setStyle({
            fillColor: "lightgrey",
        fillOpacity: 0.6,
        color: "dimgrey",
        weight: 1
        });
    });
    
        d3.select("#map_legend").style("display", "none")
    d3.select("#counties_info").selectAll("p").style("color", "black")
}


