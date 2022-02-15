
let providerData;

let tooltipNew3 = d3.select('#tooltipNew3')

const margin2 = {top: 80, right: 30, bottom: 40, left: 70},
    width2 = 600 - margin2.left - margin2.right,
    height2 = 600 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#providerBar")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",`translate(${margin2.left},${margin2.top})`);



// Parse the Data
d3.csv("./mental health provider new_test2.csv").then( function(data) {

  // List of subgroups = header of the csv files = soil condition here
  const subgroups2 = data.columns.slice(2)
  console.log('These are ' + subgroups2)
 

const subgroupf = ['2017','2018']


  const providerData = data

  //console.log(groups)
  //console.log(unemployData)


  const allGroup = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia",
      "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
      "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
      "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
      "West Virginia","Wisconsin","Wyoming"]
  

  // add the options to the button
    d3.select("#dropdown3")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text((option) => { return option; }) // text showed in the menu
      .attr("value", (option) => { return option; }) // corresponding value returned by the button
  




  // color palette = one color per subgroup
  const color2 = d3.scaleOrdinal()
    .domain(subgroups2)
    .range(['#e41a1c','#377eb8'])



 const draw_bar = (data ,states) => {

  let data_filtered = data.filter(d=>d["State"]==states)
  console.log(data_filtered)
  svg2.selectAll("*").remove()

    // Add X axis
    const x = d3.scaleBand()
    .domain(subgroupf)
    .range([0, width2])
    .padding([0.2])
    

svg2.append("g")
.style("font-size","25px")

  .attr("transform", `translate(0, ${height2})`)
  .call(d3.axisBottom(x).tickSize(0));


// Another scale for subgroup position?
const xSubgroup = d3.scaleBand()
  .domain(subgroups2)
  .range([0, x.bandwidth()])
  .padding([0.05])



  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 4500])
    .range([ height2, 0 ]);

  svg2.append("g")
  .style("font-size","15px")
    .call(d3.axisLeft(y));


  const bars = svg2.append("g")
  .selectAll("g")
  // Enter in data = loop group per group
  .data(data_filtered)
  .join("g")
    .attr("transform", d => `translate(${x(d.Year)}, 0)`)
  .selectAll("rect")
  .data(function(d) { 
      return subgroups2.map(function(key) { 
       
          return {key: key, value: d[key]}; 
      }); 
  })
  .join("rect")
    .attr("x", d => xSubgroup(d.key))
    .attr("y", d => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", d => height2 - y(d.value))
    .attr("fill", d => color2(d.key))
    .on("mouseover",(event,d) => {         //tooltip
      tooltipNew3
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px")
          .style("opacity", 1)
          .select("#value3")
          .text(d.value)

      // d3.select(this).style("fill",d=>{
      //   return d3.rgb(color2(d.value)).brighter(2);
      //   })
     
    
    })
      .on("mouseout", function () { 


      // Hide the tooltip
      tooltipNew3
          .style("opacity", 0);

      // d3.select(this).style("fill",d=>{
      //   return d3.rgb(color2(d.value));
      //   })
    })




    //legend
    const legendc = svg2.selectAll(".legend")
    .data(subgroups2)
    .enter().append("g")
    .attr("class", "legends")
    .attr("transform", function(d, i) { return "translate(" + i * 210 + ",0)"; });

    legendc.append("rect")
        .attr("x", width2 -360)
        .attr("y", margin2.top-120)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color2);

    legendc.append("text")
        .attr("x", width2 -330)
        .attr("y", margin2.top-110)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

 }

  // Show the bars
  draw_bar(data, 'Alabama');
      
  d3.select("#dropdown3").on("change", (event) => {
    // recover the option that has been chosen
    var selectedOption = event.target.value
    console.log(selectedOption)
    // run the updateChart function with this selected option
    draw_bar(data, selectedOption)
})




})
