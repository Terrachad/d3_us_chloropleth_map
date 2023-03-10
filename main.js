let countyurl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let eduurl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
let req = new XMLHttpRequest()

let countyData;
let counties;
let states;

let countyReq;
let eduReq;
let educationData;


let width = 970;
let height = 800;
let margin = 60;

const colors = ['#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c']
const percentages = [3,12,21,30,39,48,57,66]


d3.select('body').append('h1').text('United States Educational Attainment').attr('id','title').attr('x',width/2).attr('y',margin)
d3.select('body').append('h3').text(`Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`).attr('id','description').attr('x',width/2).attr('y',margin).style('text-align','center')


d3.select('body').append('svg').attr('id','canvas').attr('width', width).attr('height',height)

const svg = d3.select('svg')



const drawTheMap = async() =>{
  console.log(countyData)
  console.log(educationData)


  console.log(d3.max(educationData, function(data){
    return data['bachelorsOrHigher']
  }))

  counties = topojson.feature(countyData, countyData.objects.counties).features
  states = topojson.feature(countyData, countyData.objects.states).features

  


  console.log(countyData)
  console.log(educationData)


  const tooltip = d3.select('#tooltip')

      svg
      .selectAll('path')
      .data(counties)
      .enter()
      .append('path')
      .attr('d', d3.geoPath())
      .attr('class','county')
      .attr('fill', (item)=>{
        let id = item['id']
        let county = educationData.find((item) =>{
          return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        if(percentage > percentages[7]){return colors[7]}
        else if(percentage > percentages[6]){return colors[6]}
        else if(percentage > percentages[5]){return colors[5]}
        else if(percentage > percentages[4]){return colors[4]}
        else if(percentage > percentages[3]){return colors[3]}
        else if(percentage > percentages[2]){return colors[2]}
        else if(percentage > percentages[1]){return colors[1]}
        else{return colors[0]}
      })
      .attr('data-fips',(item) => {return item['id']})
      .attr('data-education',(item) => {
        let id = item['id']
        let county = educationData.find((item) =>{
          return item['fips'] === id
        })
        let percentage = county['bachelorsOrHigher']
        return percentage
      })
      .on('mouseover',(event,hoveredItem,index) => {

       d3.selectAll(`[data-fips='${hoveredItem.id}']`).attr('stroke','green')

       let id = hoveredItem['id']
       let county = educationData.find((hoveredItem) =>{
         return hoveredItem['fips'] === id
       })
       let percentage = county['bachelorsOrHigher']
       let name = county.area_name
       let state = county.state

       console.log(county)
        console.log(hoveredItem.id)
        tooltip
        .html(`${name}, ${state}: ${percentage}`)
        .style('left',(event.pageX) + "px")
        .style('top',(event.pageY) + "px")
        .style('color','black')
        .transition()
        .style('opacity','1')
        .attr('id','tooltip')
        .attr('data-education',(item) => {

          console.log(hoveredItem)

          return (percentage).toFixed(1)
        })
        
    })
    .on('mouseout', (event,hoveredItem,index)=>{
        d3.selectAll(`[data-fips='${hoveredItem.id}']`).attr('stroke','none')
        tooltip
        .transition()
        .style('opacity','0')
    })

      
      
    svg.append('g').attr('class','borders')

    svg
    .selectAll('borders')
    .data(states)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class','state')
    .attr('stroke', 'white')
    .attr('fill','none')
      

}

const makeTheLegend = () =>{

  const legendScale = d3.scaleLinear()
  .domain([3,66])
  .range([0, width*0.25 - margin])

  let rectheight = 10;

  svg
  .append('g')
  .attr('id','legend')
  .selectAll('rect')
  .data(colors)
  .enter()
  .append('rect')
  .attr('height',rectheight)
  .attr('width', (item,index) =>{


      return (width*0.25 - margin) / colors.length 
  })
  .attr('y', (item) =>{
      return margin
  })
  .attr('x', (item,index) =>{
      return legendScale(percentages[index]) + width /2
  })
  .attr('fill',(item, index) =>{
          return colors[index]
  })
  .attr('transform', `translate(${width*0.15},${0})`)


  
  let legendAxis = d3.axisBottom(legendScale)
  .tickValues(percentages)
  .tickFormat(function(d,i){ return `${percentages[i]}%` })


  svg
  .append('g')
  .call(legendAxis)
  .attr('id','legend-axis')
  .attr('transform', `translate(${width*0.65},${margin + rectheight})`)
}

async function fetchTheData(){
    try {
        countyReq = await fetch(countyurl)
        .then((res)=>res.json())
        .then((res)=> countyData = res)

        eduReq = await fetch(eduurl)
        .then((res)=> res.json())
        .then((res)=> educationData = res)

        drawTheMap();
        makeTheLegend();

      } catch (error) {
        console.error('There was an error', error);
      }
}

fetchTheData();
