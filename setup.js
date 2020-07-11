
/// Initialiation
const AVAILABLE_DAYS = 11;

import { run_day1, tests_day1 } from './day1.js';
import { run_day2, tests_day2 } from './day2.js';
import { run_day3, tests_day3 } from './day3.js';
import { run_day4, tests_day4 } from './day4.js';
import { run_day5, tests_day5 } from './day5.js';
import { run_day6, tests_day6 } from './day6.js';
import { run_day7, tests_day7 } from './day7.js';
import { run_day8, tests_day8 } from './day8.js';
import { run_day9, tests_day9 } from './day9.js';
import { run_day10, tests_day10 } from './day10.js';
import { run_day11, tests_day11 } from './day11.js';
// import { run_day{{n}}, tests_day{{n}} } from './day{{n}}.js';

export function setup() {
    console.log("Running setup")
    console.debug(`${Math.sign(0/-1)}, ${Math.sign(0)}`)
    // Now add the event handlers for the buttons.
    let runFn, testFn;
    for (let i = 1; i <= AVAILABLE_DAYS; i++) {
        switch (i) {
            case 1:
                runFn = run_day1;
                testFn = tests_day1;
                break;
            case 2:
                runFn = run_day2;
                testFn = tests_day2;
                break;
            case 3:
                runFn = run_day3;
                testFn = tests_day3;
                break;
            case 4:
                runFn = run_day4;
                testFn = tests_day4;
                break;
            case 5:
                runFn = run_day5;
                testFn = tests_day5;
                break;
            case 6:
                runFn = run_day6;
                testFn = tests_day6;
                break;
            case 7:
                runFn = run_day7;
                testFn = tests_day7;
                break;
            case 8:
                runFn = run_day8;
                testFn = tests_day8;
                break;
            case 9:
                runFn = run_day9;
                testFn = tests_day9;
                break;
            case 10:
                runFn = run_day10;
                testFn = tests_day10;
                break;
            case 11:
                runFn = run_day11;
                testFn = tests_day11;
                break;
            // case {{n}}:
            //     runFn = run_day{{n}};
            //     testFn = tests_day{{n}};
            //     break;
            default:
                break;
        }

        document.getElementById(`button-day${i}`).addEventListener("click", runFn);
        document.getElementById(`button-tests${i}`).addEventListener("click", testFn);
    }
    console.log("Finished setup")
}
