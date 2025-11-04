// algorithms/mergesort.js
export function makeMergeSortEngine() {
    // Primary state
    let a = [];
    let tmp = [];
    let stack = []; // frames drive the algorithm
    let done = false;
    

    // Frame shapes:
    // { type:'split', lo, hi }

    function init({ array }) {
        a = array.slice();
        tmp = new Array(a.length);
        stack = [{ type: 'split', lo: 0, hi: a.length }];
        done = a.length <= 1; // already sorted
    }

    // [0, 1, 2, 3]

    function step() {

        // End if we have reached an empty stack
        if (stack.length === 0) {done = true; return;}

        // Peek top frame
        const f = stack[stack.length - 1];
        
        // Handle each type of frame differently
        if (f.type === 'split'){
            // This frame gets replaced with it's split children eventually down to one element arrays
            const frame = stack.pop();
            const lo = frame.lo, hi = frame.hi;
            if (hi - lo <= 1) return;   // Base case nothing to push to stack

            const mid = lo + ((hi - lo) >> 1);
            // Push so that left then right then merge
            stack.push({type: 'merge', lo, mid, hi, i: lo, j: mid, k: lo, phase: 'fill', c:lo});
            stack.push({type: 'split', lo: mid, hi});
            stack.push({type: 'split', lo, hi: mid});

            return;
        }

        // MERGE frame: do exactly ONE micro-step
        if (f.type === 'merge'){
            if(f.phase === 'fill'){
                if(f.i < f.mid && f.j <f.hi){
                    // Compares left and right heads and copys the left or right if equal or less then
                    if(a[f.i] <= a[f.j]){ tmp[f.k++] = a[f.i++]; } 
                    else                { tmp[f.k++] = a[f.j++]; }
                    return; 
                }
                // If either is empty we need to fill the remaining elements from the other side, we only reach this once one side is done
                if(f.i < f.mid) {tmp[f.k++] = a[f.i++]; return; }
                if(f.j < f.hi) {tmp[f.k++] = a[f.j++]; return; }

                // Both sides must be done, swap to copy phase
                f.phase = 'copy';
                f.c = f.lo;
                return;
            }
        }

        // COPY phase: copy one element back per step
        if (f.phase === 'copy') {
            if (f.c < f.hi) { a[f.c] = tmp[f.c]; f.c++; return; }
            // finished copying → pop merge frame
            stack.pop();
            if (stack.length === 0) done = true;
            return;
        }
    }

    function isDone() {
        return done;
    }

    // Expose useful state for a visualizer
    function getState() {
        const top = stack[stack.length - 1] || null;
        return {
        a: a.slice(),   // Array slice
        i: top.i,
        mid: top.mid,
        j: top.j,
        hi: top.hi,
        type: top.type,
        };
    }
    return { init, step, isDone, getState };
}



