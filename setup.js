
/// Initialiation
const NUM_DAYS = 25;
const AVAILABLE_DAYS = 2;

import { run_day1, tests_day1} from './day1.js';
import { run_day2, tests_day2 } from './day2.js';

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
    document.getElementById(`button-day1`).addEventListener("click", run_day1);
    document.getElementById(`button-tests1`).addEventListener("click", tests_day1);
    document.getElementById(`button-day2`).addEventListener("click", run_day2);
    document.getElementById(`button-tests2`).addEventListener("click", tests_day2);
}
