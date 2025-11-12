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
        stack = [{ type: 'pivot', lo, hi }];
        done = false;
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
            // choose a pivot index inside [lo, hi]
            const pvt = lo + ((hi - lo) >> 1);
            const pivotValue = a[pvt];

            // begin partition; carry everything you need forward
            stack.push({
                type: 'scanLeft',
                lo, hi, pvt, pivotValue,
                i: lo,              // left scan pointer
                j: hi               // right scan pointer (scanRight will update this)
            });
            consoleDebug();
            return;
        }

        if(f.type === 'scanLeft'){
            let { i } = f;
            while (i <= f.hi && a[i] < f.pivotValue) i++;
            stack.pop();
            stack.push({ type: 'scanRight', lo: f.lo, hi: f.hi, pvt: f.pvt, pivotValue: f.pivotValue, i, j: f.j });
            consoleDebug();
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
                if (i < f.hi) stack.push({ type: 'pivot', lo: i,     hi: f.hi });
            }
            consoleDebug();
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
            consoleDebug();
            return;
        }
    }


    function isDone() {
    // return true when there are no more steps
    }

    function getState() {
        const top = stack[stack.length - 1] || null;

        return {
            a: a.slice(),
            type:  top?.type ?? null,

            // ranges
            lo:  top?.lo  ?? -1,
            mid: top?.mid ?? -1,
            hi:  top?.hi  ?? -1,

            // merge heads
            i: top?.i ?? -1,
            j: top?.j ?? -1,

            pvt: top?.pvt ?? -1,

            // (optional) internal cursors for debugging
            // k: top?.k ?? -1,
            // c: top?.c ?? -1,

            done,
        };
    }
    return { init, step, isDone, getState };
}
