
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
            results += `<td><button id ="day${i}" type="button">Solve!</button></td>`;
            results += `<td><button type="button" id ="tests${i}">Unit tests!</button></td>`;
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
