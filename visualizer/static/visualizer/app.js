console.log("D3 loaded:", d3);

d3.select("#viz")
    .append("svg")
    .attr("width", 400)
    .attr("hight", 200)
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 100)
    .attr("r", 40)
    .attr("fill", "steelblue");

console.log("D3 test circle loaded.")

// JS for slider updates
const slider = document.getElementById("myRange");
const output = document.getElementById("rangeValue");

if (!slider || !output) {
  console.error("Missing #myRange or #rangeValue", { slider, output });
} else {
  output.textContent = slider.value;        // set initial
  slider.addEventListener("input", () => {  // live updates
    output.textContent = slider.value;
  });
}

// JS for hamburger menu

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

const menuButton =  document.getElementById("menuButton");
const algoLinks = document.querySelectorAll(".algo-link");

algoLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        console.log(link.dataset.name, " clicked");
        e.preventDefault();
        const selectedName = link.dataset.name;
        menuButton.textContent = selectedName;
        closeNav();
    })
});