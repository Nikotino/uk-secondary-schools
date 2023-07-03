var value_color;
var map_colors=["red", "yellow", "green"]
var criteria;

////define map color

function update_map(criteria, order)
                    
                    {
                     
if (order=="asc") {map_colors=["red", "yellow", "green"]}
else if (order=="desc") {map_colors=["green", "yellow", "red"]}
                            
                        
    console.log("criteria", criteria)
                        
value_color =
    d3.scaleLinear()
.domain([d3.min(counties_filtered,d=>d['properties'][criteria]), d3.median(counties_filtered,d=>d['properties'][criteria]),
            d3.max(counties_filtered,d=>d['properties'][criteria])])
.range(map_colors);

}
