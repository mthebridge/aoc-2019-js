import { read_text_input, test_assert } from "./utils.js";
import { run_program, test_program } from "./intcode.js";

function run_day5() {
    read_text_input("inputs/day5.txt", (input) => {
        let program = input.split(",");
        let inputs = [1];
        let outputs = run_program(program, inputs);

        document.getElementById("day5").innerHTML = `TEST aircon program Outputs: ${outputs}`;
    })
}

function tests_day5() {
    let passes = 0;
    passes += test_program("Test 1.1",
    [1002,4,3,4,33],
    "1002, 4, 3, 4, 99");
    document.getElementById("tests5").innerHTML = `TEsts ${passes}/1 passed`;

}

export { run_day5, tests_day5 };