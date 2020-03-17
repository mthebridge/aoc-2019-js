
/// Initialiation
const NUM_DAYS = 25;
const AVAILABLE_DAYS = 2;

import { run_day1, tests_day1} from './day1.js';
import { run_day2, tests_day2 } from './day2.js';

export function setup() {
    console.log("Runing setup")
    let results = "";
    results += '<table style="width:100%">';
    //<th>Puzzle</th><th>Output</th><th>Tests</th>
    for (let i = 1; i <= NUM_DAYS; i++) {
        results += "<tr>";
        results += `<td>Day ${i}</td>`;
        if (i <= AVAILABLE_DAYS) {
            results += `<td><div id="day${i}"><button  type="button">Solve!</button></div></td>`;
            results += `<td><div id="tests${i}"><button type="button">Unit tests!</button></div></td>`;
        } else {
            results += `<td>-</td>`;
            results += `<td>-</td>`;
        }
        results += "</tr>"
    }
    results  += "</table>";
    document.getElementById("results").innerHTML = results

    // Now add the event handlers for the buttons.
    document.getElementById(`day1`).addEventListener("click", run_day1);
    document.getElementById(`tests1`).addEventListener("click", tests_day1);
    document.getElementById(`day2`).addEventListener("click", run_day2);
    document.getElementById(`tests2`).addEventListener("click", tests_day2);
}
