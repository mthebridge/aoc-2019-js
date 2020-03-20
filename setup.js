
/// Initialiation
const NUM_DAYS = 25;
const AVAILABLE_DAYS = 5;

import { run_day1, tests_day1 } from './day1.js';
import { run_day2, tests_day2 } from './day2.js';
import { run_day3, tests_day3 } from './day3.js';
import { run_day4, tests_day4 } from './day4.js';
import { run_day5, tests_day5 } from './day5.js';

export function setup() {
    console.log("Running setup")
    let results = "";
    results += '<table style="width:100%"><th>Puzzle</th><th>Output</th><th>Tests</th>';
    for (let i = 1; i <= NUM_DAYS; i++) {
        results += "<tr>";
        results += `<td width="10%">Day ${i}</td>`;
        if (i <= AVAILABLE_DAYS) {
            results += `<td width="60%"><button  id="button-day${i}" type="button">Solve!</button><span id="day${i}">???</span></td>`;
            results += `<td width="30%"><button id="button-tests${i}" type="button">Unit tests!</button><span id="tests${i}">Not yet run</span></td>`;
        } else {
            results += `<td>-</td>`;
            results += `<td>-</td>`;
        }
        results += "</tr>"
    }
    results  += "</table>";
    document.getElementById("results").innerHTML = results

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
            default:
                break;
        }

        document.getElementById(`button-day${i}`).addEventListener("click", runFn);
        document.getElementById(`button-tests${i}`).addEventListener("click", testFn);
    }
    console.log("Finished setup")
}
