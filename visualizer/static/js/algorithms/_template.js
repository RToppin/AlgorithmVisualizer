// algorithms/_template.js
export function makeEngine() {
  // internal/private state
  // e.g., for arrays: let a=[], i=0, j=0, done=false;

  function init(input) {
    // load input and reset all internal vars
  }

  function step() {
    // do exactly one small step of the algorithm
  }

  function isDone() {
    // return true when there are no more steps
  }

  function getState() {
    // return ONLY what the renderer needs (pure data)
    return {/* snapshot */};
  }

  return { init, step, isDone, getState };
}
