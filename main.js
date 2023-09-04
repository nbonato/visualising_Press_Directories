Chart.register(ChartDataLabels);

var infoBox = document.getElementById("info-box");
var infoBoxMessage = document.getElementById("info-box-message");
var pressChartWrapper = document.createElement("div");
var pressChart = document.createElement("canvas")
pressChartWrapper.appendChild(pressChart);

var electionChartWrapper = document.createElement("div");
var electionChart = document.createElement("canvas")
electionChartWrapper.appendChild(electionChart);

pressChartWrapper.classList.add("donut-chart-wrapper");
electionChartWrapper.classList.add("donut-chart-wrapper");
infoBox.appendChild(pressChartWrapper);
infoBox.appendChild(electionChartWrapper);


const radioButtons = document.querySelectorAll('input[name="display-dataset"]');
const legendTitle = document.getElementById("legend-title");
var displayDataset = document.querySelector('input[name="display-dataset"]:checked').value;

const pressColourScheme = {
    "liberal": 'red',
    "multiple majority": "#4CBB17",
    "independent": "gold",
    "neutral": "DarkSlateGray",
    "conservative": '#005ac2',
    "undefined": "gray",
    "unionist" : "MidnightBlue",
    "constitutional": "Olive",
    "nationalist": "Tomato",
    "liberal; unionist": "BlueViolet",
    "liberal; conservative": "purple",
    "independent; liberal": "pink",
    "no-politics": "gray",
    "whig": "orange",
    "other" : "fuchsia"
};

const electionsColourScheme = {
    'Liberal Party (Original)': 'red',
    "multiple majority": "#4CBB17",
    'Conservative': '#005ac2',
    'Unionists': 'MidnightBlue',
    'Labour Party': 'DarkRed',
    'Conservatives (Coalition)': 'teal',
    'Liberals (Coalition)': 'orange',
    'Liberal Unionists': 'BlueViolet',
    'Independent Liberals': 'blue',
    'Nationalists': 'Tomato',
    'Sinn Fein': 'ForestGreen',
    'National Liberals': 'violet',
    'Independent Unionists': 'lime',
    'Independent Nationalists': '#ff9380',
    'Anti-Parnell Nationalists': '#ffbeb3',
    'Independent Conservatives': 'magenta',
    'Independent Labour': 'brown',
    'Peelites': 'indigo',
};
    

let colourScheme;

// Define a colour scheme based on the radio button value

switch (displayDataset) {
    case "Elections":
        colourScheme = electionsColourScheme;
        legendTitle.textContent = "Majority parties"
        break;
    case "Press":
        colourScheme = pressColourScheme;
        legendTitle.textContent = "Press leanings"
        break;
}
const legendDiv = document.getElementById('legendDiv');

for (const label in colourScheme) {
  const color = colourScheme[label];
  const legendItem = document.createElement('div');
  legendItem.className = 'colour-scheme-legend-item';
  legendItem.innerHTML = `
    <div class="colour-scheme-square" style="background-color: ${color};"></div>
    ${titleCase(label)}
  `;
  legendDiv.appendChild(legendItem);
} 





// Define geojsonLayer outside so it's accessible by the select element
let geojsonLayer;


// Get the value display element
var yearSelectValue = document.getElementById("year-select-value");



// Define a variable to store the clicked layer
var clickedLayer = null;

// Create the map
var map = L.map('map', {
    zoomControl: false, // Disable zoom control
    minZoom: 4.5, // Set maximum zoom level
    zoomSnap: 0.25 
}).setView([55.3781, -3.4360], 4.5);

// Block users from panning away from the map
map.setMaxBounds(map.getBounds());

document.getElementById("reset-button").onclick = function() {
    map.setView([55.3781, -3.4360], 4.5);
    infoBoxMessage.textContent = "Click on any available county to see the data. If a county is grayed out, it means that there are no press information on it for that year, so try moving around the slider above.";

};
// Find the first election year that is equal or greater than the target year.
var electionYears = [1847, 1852, 1857, 1859, 1865, 1868, 1874, 1880, 1885, 1886, 1892, 1895, 1900, 1906, 1910, 1918, 1922]

var pressYears = [1846]
var year = pressYears[0]; // Initial value of the year variable
var closestElection = electionYear(year); // First available election

var county = "";



// Test range
const range = document.querySelector(".range");
const bubble = document.querySelector(".bubble");



function titleCase(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

// Create a function to snap the slider to the nearest year in the list
function snapToYear(value) {
  const closestYear = pressYears.reduce((closestYear, year) => {
    const distance = Math.abs(year - value);
    return distance < Math.abs(closestYear - value) ? year : closestYear;
  }, pressYears[0]);
  return closestYear;
}

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  // Numbers based on size of the native UI indicator
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}



// Function to calculate the next closest election year
function electionYear(pressYear) {
    let largerYear = null;
    for (const electionYear of electionYears) {
        if (electionYear >= pressYear) {
            largerYear = electionYear;
        return largerYear
        }
    }
}

// Function to find the intersection of two lists
function findIntersection(list1, list2) {
    const intersection = [...new Set(list1)].filter(item => list2.includes(item));
    return intersection;
}

// Function to update the map

function updateMap(geojsonLayer) {
    geojsonLayer.resetStyle();
    let updateDataset;
    let updateYear;
    if (displayDataset === "Press") {
        updateDataset = pressDirectories;
        updateYear = year;
    } else {
        updateDataset = elections;
        updateYear = closestElection;
    };


    let availableCounties = Object.keys(updateDataset[updateYear]);


    // Loop through the GeoJSON features and update fillColor based on selectedYear
    geojsonLayer.eachLayer(function (layer) {
        let countyName = layer.feature.properties.NAME.toLowerCase();
        if (availableCounties.includes(countyName)) {
            let majorityColour = colourScheme[updateDataset[updateYear][countyName]["majority"]]
            layer.available = true;
            layer.setStyle({
                fillColor: majorityColour,
                color: majorityColour
            });

        } else {
            layer.available = false;
            layer.setStyle({
                fillColor: "gainsboro",
                opacity: 1,
                color: "lightgray"
            });
        }

        
    });

}

// Function to update the info box
function updateView(county, year) {
    // Retrieve the data for the specific key
    var pressChartData = pressDirectories[year][county.toLowerCase()];
    if (county != "") {
        if (typeof(pressChartData) === "undefined") {
            infoBoxMessage.textContent =`There is no press data for ${county}`;
            pressChart.innerHTML = "";
            return
        };
    } else {
        infoBoxMessage.textContent = "Click on any available county to see the data. If a county is grayed out, it means that there are no press information on it for that year, so try moving around the slider above.";
        return
    };
    // Create the chart
    chartCreator(pressChart, pressChartData["press_data"], "Press leanings", "Press");

    // Retrieve the data for the specific key
    var electionChartData = elections[closestElection.toString()][county.toLowerCase()];

    if (typeof(electionChartData) === "undefined") {
        infoBoxMessage.textContent =`There are no electoral results for ${county} in ${year}`;
        electionChart.innerHTML = "";        
        return
    };
    // Create the chart
    chartCreator(electionChart, electionChartData["data"], "MPs elected", "Elections");

    infoBox.innerHTML = "";
    var infoBoxContent = document.createElement("div");
    infoBoxContent.className = "chart-container"
    infoBoxContent.appendChild(pressChartWrapper);
    infoBoxContent.appendChild(electionChartWrapper);
    infoBox.appendChild(infoBoxContent);
}

// Function to create the chart

function chartCreator(canvas, data, titleText, typeDataset) {
    // Get the existing chart instance
    let existingChart = Chart.getChart(canvas);

    // Destroy the existing chart if it exists
    if (existingChart != undefined) {
        existingChart.destroy();
    };

    // Extract labels and values from the data
    var labels = Object.keys(data);
    var values = Object.values(data);

    switch (typeDataset) {
        case "Elections":
            backgroundColor = labels.map(label => electionsColourScheme[label]);
            break;
        case "Press":
            backgroundColor = labels.map(label => pressColourScheme[label]);
            break;
    }
    new Chart(canvas.getContext('2d'), {
        type: "doughnut",
        data: {
            label: "Chart",
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColor,

            }]
        },
        options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: true,
            layout: {
                padding: {
                  left: 30
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${titleText} in ${titleCase(county)} in ${year}`,
                },
                datalabels : {
                    color: "white"
                },
                legend: {
                    display: false,
                }
            }
        }
    });

};

// Function to fetch a JSON file and return a promise
function fetchJSON(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
}



// Fetch both JSON files and store them
Promise.all([
    fetchJSON('scripts/elections.json'),
    fetchJSON('press_data.json'),
    fetchJSON('updated_map.json')
])  
.then(([elections, pressDirectories, mapJson]) => {
    // Both JSON files have been successfully fetched and parsed

    // Create global variables for these datasets
    window.elections = elections;
    window.pressDirectories = pressDirectories;
    window.mapJson = mapJson
    initialiseWebApp();
})
.catch(error => {
    // Handle errors if any of the fetches fail
    console.error('Error fetching JSON:', error);
});



// Function to initialize the web app 
function initialiseWebApp() {
    pressYears = Object.keys(pressDirectories);
    // Set the minimum and maximum values of the slider
    range.min = pressYears[0];
    range.max = pressYears[pressYears.length - 1];


    setBubble(range, bubble);
    // Store the old value to fire the script in the event listener
    // only when the range has actually changed
    let oldRange = range.value;
    // Update the map when the select value changes
    range.addEventListener("input", () => {
        range.value = snapToYear(range.value);
        if (range.value != oldRange) {
            year = parseInt(snapToYear(range.value));
            setBubble(range, bubble);
            closestElection = electionYear(year);
            yearSelectValue.innerText = `You picked ${year}, the closest election was in ${closestElection}`;
            updateMap(geojsonLayer);
            updateView(county, year);
            oldRange = range.value;
        }

    });
    
    // Removes the attribution watermark
    map.attributionControl.setPrefix(''); 
      
    geojsonLayer = L.geoJSON(mapJson, {
        style: {
            weight: 1,
            fillOpacity: 0.9
            
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', function () {
                if (layer.available == true) {
                    county = feature.properties.NAME.toLowerCase();
                    // Change the style of the clicked feature
    
     
    
                    updateMap(geojsonLayer);
                    layer.setStyle({
                        color: "DarkSlateGray",
                        weight: 4
    
                        
                    });
                    layer.bringToFront()
                    updateView(county, year);

                } else {
                    alert("This county is not available")
                }
                
            });
        }
    }).addTo(map);

    updateMap(geojsonLayer);

    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', (event) => {
            displayDataset = event.target.value;
            switch (displayDataset) {
                case "Elections":
                    colourScheme = electionsColourScheme;
                    legendTitle.textContent = "Majority parties"
                    break;
                case "Press":
                    colourScheme = pressColourScheme;
                    legendTitle.textContent = "Press leanings"
                    break;
            }
            legendDiv.innerHTML = "";

            for (const label in colourScheme) {
                const color = colourScheme[label];
                const legendItem = document.createElement('div');
                legendItem.className = 'colour-scheme-legend-item';
                legendItem.innerHTML = `
                  <div class="colour-scheme-square" style="background-color: ${color};"></div>
                  ${titleCase(label)}
                `;
                legendDiv.appendChild(legendItem);
            } 
              

            updateMap(geojsonLayer);
        });
    });
}

