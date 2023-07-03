var info={"school_name": "school", "address": "address", "school_type":"type", "rank":"school_rank", "school_results":["A_LEVEL", "A_LEVEL_1", "A_LEVEL_2", "GCSE"], 
"school_gender_age":"gender_age", "day_fee":"fee", "boarding_fee":"boarding_fee"}


markers.map(d=> d.on("click", function(x) {
for (item in info)
{

    d3.select("#"+info)
    .append("text")
.text(function(){
    if (item!="school_results")   //school results has multiple items
    {return x.target.option[info[item]]}
    else
    {for (i in item)
        {return info[item][i]+": "+x.target.option[info[item][i]]}
    }}
    )
.attr("font-family", "Arial")
.attr("font-size", "12px")
}
 
 ///display infopanel
 d3.select("#infopanel").style("display", "block")   
}
))
