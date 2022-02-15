let allageData
let filData

// set the dimensions and margins of the graph
var margin3 = {top: 20, right: 20, bottom: 40, left: 80},
     width3 = 700 - margin3.left - margin3.right,
     height3 = 700 - margin3.top - margin3.bottom;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width3, height3) / 2 - margin3

// append the svg object to the div called 'my_dataviz'
var svg3 = d3.select(".pieCh")
.append("svg")
.attr('width', width3 + margin3.right + margin3.left)
.attr('height', height3 + margin3.top + margin3.bottom)
 .attr("transform","translate(200,0)");   

var chart=svg3.append('g')
.attr('transform', 'translate(' + margin3.left + ',' + margin3.top + ')')
.attr('width', width3)
.attr('height', height3)

const allYear = ['2015','2016','2017','2018','2019']

// add the options to the button
d3.select("#dropdown4")
.selectAll('myOptions')
 .data(allYear)
.enter()
.append('option')
.text((option) => { return option; }) // text showed in the menu
.attr("value", (option) => { return option; }) // corresponding value returned by the button




d3.csv("./WISQARS_lcd_ypll_BarChart_85all.csv").then( function(data) {

            
 
let  colors=["#00A5E3","#FF96C5","#00CDAC","#FFA23A","#74737A","#DC143C","#800000","#8B008B",
"#CFD61E","#4169E1","#DE14F5","#006400","#FF1493","#D2691E","#BC8F8F","#ADFF2F"]  


let color_scale   
let tooltipNew = d3.select('#tooltipNew')

const duration = 250;

  const draw_pie = (data, year) =>{
   
    chart.selectAll("*").remove()
    let filter1 = data.filter(d=>
      d["Year"]==year
      )
    console.log(filter1)
    filData = filter1.map( d =>{
      return {Age_Group: d.Age_Group, value: d.Number_of_deaths, percentage: d.Percentage}
    }
    )
    console.log(filData)

  
    color_scale = d3.scaleOrdinal()
    .domain(filData.map(d=>d.Age_Group))
    .range(colors); 

    
    var pie=d3.pie() 
    .value(d => d.value)
  


    let arc=d3.arc()
    .innerRadius(Math.min(width3, height3) / 2 - 250)
    .outerRadius(Math.min(width3, height3) / 2 - 100)
    .cornerRadius(15);

    var label = filData.map(d=>d.Age_Group)

    console.log(label)

    var p_chart=chart.selectAll("pie")
    .data(pie(filData))
    .enter()
    .append("g")
    .attr('transform', 'translate(210,350)')
    .append("path")
    .attr("d",arc) 
    .attr("fill",d=>{
    return color_scale(d.data.value);
    })   
    .attr("stroke", "white") 

    let color2 = "#00A5E3"
    let color3 = d3.rgb(color2).brighter(1)
    console.log(color3)

    //animation start
    p_chart.on("mouseover", function(d,filData){
 
      console.log(d3.select(this))
      d3.select(this).style("fill",d=>{
        return d3.rgb(color_scale(d.data.value)).brighter(1);
        })
        .transition()
          .duration(duration)
        .attr('transform', calcTranslate(filData, 6));

      tooltipNew
            .style("opacity", 1)
            .style("left", d.pageX + "px")
            .style("top", d.pageY + "px")
            .style("opacity", 1)
            .select("#value")
            .text(filData.data.Age_Group + " is " + filData.data.percentage*100)
        
    })
    .on("mouseout", function () { 
      d3.select(this).style("fill",d=>{
        return color_scale(d.data.value);
        })
        .transition()
        .duration(duration)
        .attr('transform', 'translate(0, 0)');

        d3.select(this).select('path')
        .transition()
        .duration(duration)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);

        // Hide the tooltip
        tooltipNew
            .style("opacity", 0);
          
      })

      //animation back
      function calcTranslate(data, move = 4) {
        const moveAngle = data.startAngle + ((data.endAngle - data.startAngle) / 2);
        return `translate(${- move * Math.cos(moveAngle + Math.PI / 2)}, ${- move * Math.sin(moveAngle + Math.PI / 2)})`;
      }

    p_chart.append("text")

    .text(function(d){ return d.data.percentage +"%"})
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  }) 
    .style("text-anchor", "middle")  


    //legend
    const legend3 = svg3.selectAll(".legend3")
    .data(label)
    .enter().append("g")
    .attr("class", "legends")
    .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });

    legend3.append("rect")
        .attr("x", width3 -50)
        .attr("y", 70-margin3.top)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color_scale);

    legend3.append("text")
        .attr("x", width3 -15)
        .attr("y", 80-margin3.top)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });



}

// Show the pie
draw_pie(data,"2019")

d3.select("#dropdown4").on("change", (event) => {
  // recover the option that has been chosen
  var selectedOption3 = event.target.value
  console.log(selectedOption3)
  // run the updateChart function with this selected option
  draw_pie(data, selectedOption3)
})


})
