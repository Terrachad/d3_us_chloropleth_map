let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let req = new XMLHttpRequest()



let width = 1200;
let height = 500;
let margin = 60;


req.open('GET',url,true)
req.onload = () => {
    let object = JSON.parse(req.responseText)
    baseTemp = object['baseTemperature']
    variances = object['monthlyVariance']
}
req.send()