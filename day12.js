// Replace 12 with the day number, then rename and save.
// Solutions for AoC day 12
import { read_text_input, test_assert } from "./utils.js";

function run_day12() {
    read_text_input("inputs/day12.txt", (input) => {
        document.getElementById("day12").innerHTML = ``;
    })
}

function tests_day12() {
    let passes = 0;
    document.getElementById("tests12").innerHTML = `${passes}/0 tests passed!`;

}

export { run_day12, tests_day12 };