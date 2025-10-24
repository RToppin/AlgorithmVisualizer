console.log("D3 loaded:", d3);

// Declare svg outside to allow multiple function interactions
 let svg;

// STATE
const state = {
  selectedAlgo: null,
  size: null,
};

// LAST STATE
const lastState = {
  prevSelectedAlgo: null,
  prevSize: null,
};

// CONSTANTS

const minSize = 2;
const maxSize = 50;

// ELEMENTS
const slider = document.getElementById("myRange");
const playBtn = document.getElementById("playBtn")
const output = document.getElementById("rangeValue");
const menuButton = document.getElementById("menuButton");
const algoLinks = document.querySelectorAll(".algo-link");

// GUARDS
if (!slider || !output) {
  console.error("Missing #myRange or #rangeValue", { slider, output });
} else {
  // init slider UI + state
  output.textContent = slider.value;
  state.size = Number(slider.value);

  // live slider updates: update state.size only; keep the same algorithm
  slider.addEventListener("input", () => {
    output.textContent = slider.value;
    state.size = Number(slider.value);
    loadAlgo();
  });
}

// SIDENAV

function openNav() {document.getElementById("mySidenav").style.width = "250px";}
function closeNav() {document.getElementById("mySidenav").style.width = "0";}

// ALGORITHM SELECTION
algoLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        console.log(link.dataset.name, " clicked");
        e.preventDefault();
        const name = link.dataset.name;
        state.selectedAlgo = name;            // Remember Last Clicked
        if (menuButton) menuButton.textContent = name;
        closeNav();
        loadAlgo();
    });
});

// PLAY BUTTON

playBtn.addEventListener("click", (e) => {
  
  play();
});

// LOAD ALGORITHM

function loadAlgo(){
  if (state.selectedAlgo == lastState.prevSelectedAlgo && state.size == lastState.prevSize){
    console.log("No Change Detected")
    return;
  }else{
    lastState.prevSelectedAlgo = state.selectedAlgo;
    lastState.prevSize = state.size;
  
    console.log("D3 loaded");
    
    d3.select("#chartContainer").select("svg").remove(); // clears old SVG

    const { width, height } = document.getElementById("chartContainer").getBoundingClientRect();
    const numCircles = state.size;
    const spacing = (width / numCircles) * .6;
    const radius =(width / numCircles) * .25;
    const start = -((numCircles - 1) / 2) * spacing;

    const data = Array.from({ length: numCircles }, (_, i) => start + i * spacing);

    const arr = Array.from({ length: numCircles }, () =>
      Math.floor(Math.random() * 101) - 50
    );

    svg = d3.select('#chartContainer')  // Select the div to put the canvas in
      .append("svg")                          // Adds an svg element inside of the container
      .attr("width", width)
      .attr("height", height)

      // Shift origin to the center of the screen
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    

    // Circles
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => d)
      .attr("cy", 0)
      .attr("r", radius)
      .attr("fill", "teal")
      .attr("data-value", (d, i) => arr[i]);

    const combined = data.map((x, i) => ({ x, value: arr[i] }));

    svg.selectAll("text")
      .data(combined)
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text(d => d.value);

    
    console.log(radius + " " + spacing);
  }
  
}



// PLAY TEST

function play(){
  console.log("Press btn");
  const targetVal = 0;
  svg.selectAll(`circle[data-value="${targetVal}"]`)
   .attr("fill", "red")
   .attr("cy", 50);
  svg.selectAll("text")
  .filter(d => d.value === targetVal)
  .attr("y", 55);
}


