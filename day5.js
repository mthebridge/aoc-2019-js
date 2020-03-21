import { read_text_input, test_assert } from "./utils.js";
import { run_program, test_program } from "./intcode.js";

function run_day5() {
    read_text_input("inputs/day5.txt", (input) => {
        let program = input.split(",");
        // Part1 - run the TEST program with input 1 (aircon).
        let outputs1 = run_program(program, [1]);
        // Part2 - run the TEST program with input 5 (thermals).
        program = input.split(",");
        let outputs2 = run_program(program, [5]);

        document.getElementById("day5").innerHTML = `TEST aircon: ${outputs1}, TEST Radiator control:${outputs2} `;
    })
}

function tests_day5() {
    let passes = 0;
    passes += test_program("Test 1.1",
        [1002, 4, 3, 4, 33],
        "1002, 4, 3, 4, 99");
    let testEqualEight1 = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
    let testEqualEight2 = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
    let testLessThanEight1 = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
    let testLessThanEight2 = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
    passes += test_assert("Test 2.1", run_program(testEqualEight1, [8])[0], 1);
    passes += test_assert("Test 2.2", run_program(testEqualEight2, [8])[0], 1);
    passes += test_assert("Test 2.3", run_program(testEqualEight1, [7])[0], 0);
    passes += test_assert("Test 2.4", run_program(testEqualEight1, [-8])[0], 0);
    passes += test_assert("Test 2.5", run_program(testEqualEight2, [9])[0], 0);

    passes += test_assert("Test 2.6", run_program(testLessThanEight1, [8])[0], 0);
    passes += test_assert("Test 2.7", run_program(testLessThanEight1, [7])[0], 1);
    passes += test_assert("Test 2.8", run_program(testLessThanEight2, [8])[0], 0);
    passes += test_assert("Test 2.9", run_program(testLessThanEight2, [7])[0], 1);

    let testLessEqualGreaterEight = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
        1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
        999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
    passes += test_assert("Test 2.10", run_program(testLessEqualGreaterEight, [7])[0], 999);
    passes += test_assert("Test 2.11", run_program(testLessEqualGreaterEight, [8])[0], 1000);
    passes += test_assert("Test 2.12", run_program(testLessEqualGreaterEight, [9])[0], 1001);
    passes += test_assert("Test 2.13", run_program(testLessEqualGreaterEight, [-8])[0], 999);
    passes += test_assert("Test 2.14", run_program(testLessEqualGreaterEight, [88])[0], 1001);


    document.getElementById("tests5").innerHTML = `Tests ${passes}/15 passed`;

}

export { run_day5, tests_day5 };