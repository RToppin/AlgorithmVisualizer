console.log("D3 loaded:", d3);

// STATE
const state = {
  selectedAlgo: null,
  size: null,
};

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
  //TODO
}
