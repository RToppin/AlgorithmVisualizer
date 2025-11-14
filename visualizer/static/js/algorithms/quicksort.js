// algorithms/quicksort.js
export function makeQuickSortEngine() {
    // Primary state
    let a = [];
    let stack = []; // frames drive the algorithm
    let done = false;
    let debug = true;

    // Frame shapes:
    // { type:'pivot', lo, pvt, hi }
    // { type: 'scanLeft', lo, piv, hi, i, j}
    // { type: 'scanRight', lo, piv, hi, i, j}

    function init({ array }) {
        a = array.slice();
        const lo = 0, hi = a.length - 1;
        stack = [];
        if (hi >= lo) stack.push({ type: 'pivot', lo, hi });
        done = a.length <= 1;
    }

    function step() {
        // Stack is empty and we are done
        if (stack.length === 0){ done = true; return;}

        // Peek the top frame
        const f = stack[stack.length - 1];

        function consoleDebug(){
            if(debug){
                console.log(
                    "Type: " + f.type + "\n" +
                    "I: " + f.i + "\n" +
                    "J: " + f.j + "\n" +
                    "Pivot Value: " + f.pivotValue + "\n" +
                    "Array: " + a + "\n"
                );
            }
        }
        
        if(f.type === 'pivot'){

            const { lo, hi } = f;
            stack.pop();
            const pvt = lo + ((hi - lo) >> 1);
            const pivotValue = a[pvt];

            stack.push({
                type: 'scanLeft',
                lo, hi, pvt, pivotValue,
                i: lo,              // left scan pointer
                j: hi               // right scan pointer (scanRight will update this)
            });
            //consoleDebug();
            return;
        }

        if(f.type === 'scanLeft'){
            let { i } = f;
            while (i <= f.hi && a[i] < f.pivotValue) i++;
            stack.pop();
            stack.push({ type: 'scanRight', lo: f.lo, hi: f.hi, pvt: f.pvt, pivotValue: f.pivotValue, i, j: f.j });
            //consoleDebug();
            return;
        }

        if (f.type === 'scanRight') {
            let { i, j } = f;
            while (j >= f.lo && a[j] > f.pivotValue) j--;

            stack.pop();
            if (i <= j) {
                // do one swap step
                stack.push({ type: 'swap', lo: f.lo, hi: f.hi, pvt: f.pvt, pivotValue: f.pivotValue, i, j });
            } else {
                // partition finished → recurse on subranges
                if (f.lo < j) stack.push({ type: 'pivot', lo: f.lo, hi: j });
                if (i < f.hi) stack.push({ type: 'pivot', lo: i, hi: f.hi });
            }
            //consoleDebug();
            return;
        }

        if (f.type === 'swap') {
            const tmp = a[f.i]; a[f.i] = a[f.j]; a[f.j] = tmp;
            stack.pop();
            // continue partition with narrowed window
            stack.push({
                type: 'scanLeft',
                lo: f.lo, hi: f.hi, pvt: f.pvt, pivotValue: f.pivotValue,
                i: f.i + 1,         // moved past the swapped-in value
                j: f.j - 1
            });
            //consoleDebug();
            return;
        }
    }


    function isDone() {
        return done;
    }

    function getState() {
        const top = stack[stack.length - 1] || null;

        // Defaults
        let lo  = top?.lo  ?? -1;
        let hi  = top?.hi  ?? -1;
        let i   = top?.i   ?? -1;
        let j   = top?.j   ?? -1;
        let pvt = top?.pvt ?? -1;
        const type = top?.type ?? null;

        // If we're on a pivot frame, we still want to SEE pivot + pointers.
        // Derive the pivot from [lo, hi] if it's not present yet.
        const haveRange = Number.isInteger(lo) && Number.isInteger(hi) && lo >= 0 && hi >= lo;
        if (type === 'pivot' && haveRange) {
            if (!Number.isInteger(pvt) || pvt < lo || pvt > hi) {
            pvt = lo + ((hi - lo) >> 1);
            }
            // For visuals: show i/j spanning the active range on pivot frames.
            if (!Number.isInteger(i) || i < lo || i > hi) i = lo;
            if (!Number.isInteger(j) || j < lo || j > hi) j = hi;
        }

        return {
            a: a.slice(),
            type,
            lo, hi, i, j, pvt,
            done,
        };
    }
    return { init, step, isDone, getState };
}
