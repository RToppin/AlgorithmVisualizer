import { makeBubbleSortEngine } from "./algorithms/bubblesort.js";
import { makeMergeSortEngine } from "./algorithms/mergesort.js";
import { makeQuickSortEngine } from "./algorithms/quicksort.js";
import { openNav, closeNav } from "./components.js";

// Declare svg outside to allow multiple function interactions
let svg;
let engine;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

// STATE
const state = {
  selectedAlgo: null,
  size: null,
  isRunning: false,
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
const menuBtn = document.getElementById("menuBtn");
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

// MENU BTN
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("menuBtn");
  if (btn) btn.addEventListener("click", openNav);
})

// CLOSE BTN
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("closeBtn");
  if (btn) btn.addEventListener("click", closeNav);
})

// ALGORITHM SELECTION
algoLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        console.log(link.dataset.name, " clicked");
        e.preventDefault();
        const name = link.dataset.name;
        state.selectedAlgo = name;            // Remember Last Clicked
        if (menuBtn) menuBtn.textContent = name;
        closeNav();
        loadAlgo();
    });
});

// PLAY BUTTON
playBtn.addEventListener("click", async (e) => {
  playBtn.disabled = true;
  // Start running d3
  if(!state.isRunning) {
    // Initializing animation    
    const ready = await initAnimation();
    if (ready){
      state.isRunning = true;
      playBtn.textContent = "⏹ Stop";
      playBtn.style.backgroundColor = "red";
      // Stepping through
      play();
    }
  } else {
    // Stop running d3
    state.isRunning = false;
    playBtn.textContent = "▶️ Play";
    playBtn.style.backgroundColor = "green";
  }
  playBtn.disabled = false;
});

// Initialize Animation
async function initAnimation(){
  // Set engine to null to remove previously selected engines from memory
  engine = null;
  // create the engine on click (or recreate to restart)
  switch (state.selectedAlgo) {
    case "Bubble Sort": engine = makeBubbleSortEngine(); break;
    case "Merge Sort":  engine = makeMergeSortEngine();  break;
    case "Quick Sort": engine = makeQuickSortEngine(); break;
    default: console.log("No algorithm selected."); break;
  }
  if (engine){
    return true;
  } else {
    alert("Error: Invalid input. Please try again.");
    return false;
  }
}

// PLAY Animation
async function play(){
  engine.init({ array: state.arr });   // use the array created in loadAlgo()

  // optional: render the starting frame
  render(engine.getState());

  // animate until done
  while (!engine.isDone() && state.isRunning) {
    engine.step();
    render(engine.getState());
    await sleep(1000);
  }
  console.log(state.selectedAlgo, "is done or has been stopped")
}

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

   // Save the random array to state so Play can use it later
    state.arr = Array.from({ length: state.size }, () =>
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
    render({ a: state.arr, j: -2 });
  }
}

// RENDERER
function render(state){

  // Getstate()
  const {
    a, type, phase,
    lo, mid, hi,
    i, j,
  } = state;

  const n = a.length;
  const spacing = 30;
  const radius = 10;
  const startX  = -((n - 1) / 2) * spacing;
  const y0 = 0;           // center line
  const delta = 6;        // 5–10 px gap above/below center
  const h = d => Math.abs(d);
  const yTop = d => d >= 0 ? (y0 - delta - h(d)) : (y0 + delta);
  
  let highlights = (_, idx) => (idx === j || idx === j + 1 ? "orange" : "teal");
  let heightScale = 1;

  // SWITCH SELECTION

  switch(state.type){
    case "split":
      // Highlight current split range left side
      highlights = (_, idx) =>
        idx >= lo && idx < hi
          ? "rgb(51, 185, 37)" // active split band
          : "teal";
          console.log("Range: " + lo + ", " + hi);
      break;
    case "merge":
      highlights = (_, idx) => {
        //const inMergeRange = idx >= lo && idx < hi;
        const isPointer = idx === i || idx === j;   // both pointers same color

        if (isPointer) return "orange";             // active comparison
        //if (inMergeRange) return "purple";          // entire merge segment
        return "teal";                              // inactive bars
      };
      break;
    default:
      // Bubble sort case
      highlights = (_, idx) =>
        idx === state.j || idx === state.j + 1 ? "orange" : "teal";
      heightScale = 1.0;
      break;
  }

  svg.selectAll("rect")
    .data(a, (_, idx) => idx)
    .join(
      enter => enter.append("rect") 
        .attr("x", (_, idx) => startX + idx * spacing - radius)
        .attr("width", radius * 2)
        .attr("y", d => yTop(d))
        .attr("height", d => h(d)),
      update => update
        .attr("x", (_, idx) => startX + idx * spacing - radius)
        .attr("width", radius * 2)
        .attr("y", d => yTop(d))
        .attr("height", d => h(d)),
      exit => exit.remove()
    )
    .attr("fill", highlights);
}
