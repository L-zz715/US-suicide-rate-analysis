// set the dimensions and margins of the graph
const margin = {top: 100, right: 30, bottom: 40, left: 60},
    width = 660 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


let tooltipNew2 = d3.select('#tooltipNew2')

// append the svg object to the body of the page
const svg = d3.select("#unemploy_bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("./new_employment_15_19_test2.csv").then( function(data) {

    const allGroups2 = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia",
    "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
    "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
    "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
    "West Virginia","Wisconsin","Wyoming"]

    d3.select("#dropdown2")
      .selectAll('myOptions')
     	.data(allGroups2)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button


  // List of subgroups = header of the csv files = soil condition here
  const subgroups = data.columns.slice(3)
  console.log('These are ' + subgroups)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const subgroupf = ['2015','2016','2017','2018','2019']

 
  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#FFA500','#3CB371'])

 


  const draw_stbar = (data ,states) => {
    svg.selectAll("*").remove()

    let data_filtered2 = data.filter(d=>d["State"]==states)
    console.log(data_filtered2)

    const stackedData = d3.stack()
    .keys(subgroups)
    (data_filtered2)

    console.log(stackedData)

    let maxPop2 =0
   
    for(var i = 0; i < data_filtered2.length; i++) {
      if(data_filtered2[i]["Civilian labor force"] > maxPop2) {
        maxPop2 = data_filtered2[i]["Civilian labor force"]
      }
      
    }
    console.log(maxPop2)
   
     // Add X axis
    const x = d3.scaleBand()
    .domain(subgroupf)
    .range([0, width])
    .padding([0.2])
    
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .style("font-size","25px")
    .call(d3.axisBottom(x).tickSize(0));

    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Date");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, maxPop2])
    .range([ height, 0 ]);

    svg.append("g")
    .style("font-size","15px")
    .call(d3.axisLeft(y));


    const stacBar = svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.Year))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
        .on("mouseover",(event,d) => {         //tooltip

          tooltipNew2
              .style("left", event.pageX + "px")
              .style("top", event.pageY + "px")
              .style("opacity", 1)
              .select("#value2")
              .text(d[1]-d[0])
        
        })
          .on("mouseout",function () { 

          // Hide the tooltip
          tooltipNew2
              .style("opacity", 0);

         
           
        })


    //legend
    const legends = svg.selectAll(".legend")
    .data(subgroups)
    .enter().append("g")
    .attr("class", "legends")
    .attr("transform", function(d, i) { return "translate(" + i * 140 + ",0)"; });

    legends.append("rect")
        .attr("x", width -300)
        .attr("y", margin.top-170)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legends.append("text")
        .attr("x", width -270)
        .attr("y", margin.top-160)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });



  }
 

  // Show the bars
  draw_stbar(data, 'Alabama')


  d3.select("#dropdown2").on("change", (event) => {
    // recover the option that has been chosen
    var selectedOption = event.target.value
    console.log(selectedOption)
    // run the updateChart function with this selected option
    draw_stbar(data, selectedOption)
  })
})