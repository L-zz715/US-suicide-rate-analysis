let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let stateURL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'


let stateData
let suicideData
let percentage

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')
let test = d3.select('#test')
let barchart = d3.select('#barChart')

let year=2015


var dataPath = './new_change_id.csv'
// dropdown dataset selection
var dropDown = d3.select("#dropdown");
var selected_dataset = "2015";



d3.select("#dropdown")
      .selectAll('option')
     	.data(dropdown_options)
      .enter()
    	.append('option')
        .attr("value", (option) => { return option.value; })
        .text((option) => { return option.text; });



dropDown.on("change", (event) => {

    // newly selected dataset includes downtown
    d3.select("#downtown")
        .property("checked", true);

    checked = true;
    console.log(event.target)
    selected_dataset = event.target.value;
    console.log('It is' + selected_dataset)

    if(selected_dataset === "2016") {
        dataPath = './new_change_id_2016.csv'

                //csv  suicide data
        
    }
    else if(selected_dataset === "2015") {
        dataPath = './new_change_id.csv'
    }
    else if(selected_dataset === "2017") {
        dataPath = './new_change_id_2017.csv'
    }
    else if(selected_dataset === "2018") {
        dataPath = './new_change_id_2018.csv'
    }
    else if(selected_dataset === "2019") {
        dataPath = './new_change_id_2019.csv'
    }

    d3.csv(dataPath).then(
        (data, error) =>{
            if(error) {
                console.log(error)
            }else{
                
                suicideData = data
                console.log(suicideData)
                drawMap()

            }
    }
    )
    
    
});

//draw map function
let drawMap = () => {
    canvas.selectAll('*').remove()
  
    let originColor 
    canvas.selectAll('path')
           .data(stateData)
           .enter()
           .append('path')
           .attr('d',d3.geoPath())          
           .attr('class', 'state')
           .attr('fill', (stateDataItem) => {
               let id = stateDataItem['id']
               
               var state = suicideData.find((item)=> {
                //    d3.select('#limit')
                //        .on('mousemove', (d,i) =>{
                //            selectYear = this.value
                //        })
                     return item['id'] === id
                   
               })
               percentage = state['Crude Rate']
               
               if (percentage <= 5){
                return '#e7d9f4'
                }else if(percentage <= 10) {
                    return '#ceb4e9'
                }else if (percentage <= 15) {
                    return '#b48fde'
                }else if (percentage <= 20){
                    return '#996bd2'
                }else if(percentage <= 25){
                    return '#7b47c6'
                }else if(percentage <= 30){
                    return '#591eba'
                }else {
                    return '#3f1a78'
                }
           
          
           })
           .on('mouseover', (event, stateDataItem) => {
                
               console.log(d3.select(event.target).attr("fill"))

                originColor = d3.select(event.target).attr("fill")


                d3.select(event.target)
                .style("fill",d=>{
                    return d3.rgb('#FAF37B').brighter(1);
                    })

               tooltip.transition()
                .style('visibility', 'visible')

               let id = stateDataItem['id']
               let state = suicideData.find((item)=> {
                   return item['id'] === id
               })
              
               tooltip.text('State: ' + state['State'] + ', Number of Suicide population: ' + state['Death pop'] + ',000, Suicide rate: ' + state['Crude Rate'] + '%.')

                
           })
       
           .on('mouseout', (event, stateDataItem) => {

            d3.select(event.target).style("fill",d=>{
                return originColor;
                })

            //    tooltip.transition()
            //        .style('visibility', 'hidden')
           })
}



//json   map
d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log(error)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            stateData = topojson.feature(data, data.objects.states).features

            console.log(stateData)



            


            //csv  suicide data
            d3.csv(dataPath).then(
                (data, error) =>{
                    if(error) {
                        console.log(error)
                    }else{
                        
                        suicideData = data
                        console.log(suicideData)
                        drawMap()

                    }
                }
            )
           

        }
    }
)
function updateFill(selection, selected_dataset) {

    var d_extent = d3.extent(selection.data(), function(d) {
        return parseFloat(d.properties[selected_dataset]);
    });

    rescaleFill(selection, d_extent);
}

