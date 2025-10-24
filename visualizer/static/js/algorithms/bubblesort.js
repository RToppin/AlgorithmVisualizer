// Small engine used to manage the flow of the algorithm representation. 
// Includes an init, step, isDone and a getState

export function makeBubbleSortEngine(){
    let a = [], i = 0, j = 0, done = false;

    function init({array}){
        a = array.slice();
        i = 0, j = 0, done = false;
    }

    function step(){
        if (done) return; // Stop if finished

        if (a[j] > a [j + 1]){ [a[j], a[j + 1] =  a[j + 1], a[j] ], j++;}

        if (j >= a.length - i - 1){ j = 0; i++;}                // Next outer pass

        if (i >= a.length - 1) done = true;
    }

    function isDone() {return done;}
    function getState() {return {a, i, j, done }; }

    return {init, step, isDone, getState};
};