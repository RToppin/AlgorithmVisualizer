console.log("D3 loaded:", d3);

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

const minSize = 1;
const maxSize = 50;

// ELEMENTS
const slider = document.getElementById("myRange");
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

    const width = 800;
    const height = 400;
    const sizePercent = (51 - state.size) / maxSize;

    const svg = d3.select('#chartContainer')  // Select the div to put the canvas in
      .append("svg")                          // Adds an svg element inside of the container
      .attr("width", width)
      .attr("height", height)

      // Shift origin to the center of the screen
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");


      //     (-400, -200)       (0, -200)       (400, -200)
      //       +-------------------------------+
      //       |                               |
      //       |             (0,0)             |
      //       |                               |
      //       +-------------------------------+
      //     (-400, 200)         (0, 200)       (400, 200)

    // Adding circles based on data size
    const numCircles = state.size;
    const spacing = 80 * sizePercent;
    const start = -((numCircles - 1) / 2) * spacing;
    const data = Array.from({ length: numCircles }, (_, i) => start + i * spacing);
    
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => d)
      .attr("cy", 0)
      .attr("r", 30 * sizePercent)
      .attr("fill", "teal");
    
    console.log(sizePercent);
  }
  
}

