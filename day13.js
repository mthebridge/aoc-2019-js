// Replace 13 with the day number, then rename and save.
// Solutions for AoC day 13
import { read_text_input, test_assert } from "./utils.js";

function run_day13() {
    read_text_input("inputs/day13.txt", (input) => {
        document.getElementById("day13").innerHTML = ``;
    })
}

function tests_day13() {
    let passes = 0;
    document.getElementById("tests13").innerHTML = `${passes}/0 tests passed!`;

}

export { run_day13, tests_day13 };