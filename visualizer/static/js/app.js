import { makeBubbleSortEngine } from "./algorithms/bubblesort.js";

console.log("D3 loaded:", d3);

// Declare svg outside to allow multiple function interactions
let svg;
let engine;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

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

   // Save the random array to state so Play can use it later
    state.arr = Array.from({ length: numCircles }, () =>
      Math.floor(Math.random() * 101) - 50
    );

    // Build (or rebuild) the SVG
    svg = d3.select('#chartContainer')
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Initial render of the current data (no engine yet, so j = -1 to highlight none)
    render({ a: state.arr, j: -1 });
  }
}

// Layout Management
function computeLayout(n) {
  const { width } = document.getElementById("chartContainer").getBoundingClientRect();
  const spacing = (width / n) * 0.6;
  const radius  = (width / n) * 0.25;
  const startX  = -((n - 1) / 2) * spacing;
  return { spacing, radius, startX };
}

// RENDERER
function render(state){
  const {a, j} = state;
  const {spacing, radius, startX} = computeLayout(a.length);

  svg.selectAll("circle")
    .data(a, (_, idx) => idx)
    .join(
      enter => enter.append("circle")
        .attr("cy", 0)
        .attr("r", radius)
        .attr("cx", (_, idx) => startX + idx * spacing),
      update => update
        .attr("r", radius)
        .attr("cx", (_, idx) => startX + idx * spacing),
      exit => exit.remove()
    )
    .attr("fill", (_, idx) => (idx === j || idx === j + 1) ? "orange" : "teal");

  svg.selectAll("text")
    .data(a, (_, idx) => idx)
    .join(
        enter => enter.append("text")
          .attr("y", 26)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("x", (_, idx) => startX + idx * spacing),
          update => update
            .attr("x", ( _, idx) => startX + idx * spacing),
          exit => exit.remove()
    )
    .text(d => d);
}



// PLAY TEST

async function play(){
  // create the engine on click (or recreate to restart)
  engine = makeBubbleSortEngine();
  engine.init({ array: state.arr });       // use the array created in loadAlgo()

  // optional: render the starting frame
  render(engine.getState());

  // animate until done
  while (!engine.isDone()) {
    engine.step();
    render(engine.getState());
    await sleep(40);
  }
}

window.addEventListener("resize", () => {
  // Guard: engine may not exist yet (before first play)
  const a = engine ? engine.getState().a : (state.arr || []);
  if (!svg || !a.length) return;
  render({ a, j: engine ? engine.getState().j : -1 });
});




