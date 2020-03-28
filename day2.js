import { read_text_input } from "./utils.js";
import { test_program, IntCode } from "./intcode.js";

function run_gravity_assist(program, noun, verb) {
    // Take a copy of the program.
    let memory = program.slice();
    memory[1] = noun;
    memory[2] = verb;
    let GravComputer = new IntCode(memory, [])
    GravComputer.run();
    return GravComputer.memory[0]
}

function look_for_output(program) {
    const MAX_OPERAND = 99;
    for (let n = 0; n <= MAX_OPERAND; n++) {
        for (let v = 0; v <= MAX_OPERAND; v++) {
            // console.log("Trying:", n, v)
            let thisOut = run_gravity_assist(program, n, v)
            if (thisOut == 19690720) {
                console.log(`Found match at noun ${n} verb ${v}`)
                // Puzzle wants 100 * noun, plus verb
                return (100 * n) + v
            } else {
                // console.log("Output", thisOut)
            }
        }
    }
    // Shouldn't get here!
    alert("No valid answer found!")
}

function run_day2() {
    read_text_input("inputs/day2.txt", (input) => {
        let program = input.split(",");
        let result1 = run_gravity_assist(program, 12, 2);
        /// Part 2 - find the inputs that give the requested output
        let result2 = look_for_output(program);
        document.getElementById("day2").innerHTML = `Program position output <b>${result1}</b>.  Part 2 is ${result2}`;
    })
}

/// Tests for basic IntCode computer.
function tests_day2() {

    let passes = 0;
    passes += test_program("Test 1.1",
        [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50],
        "3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50");
    passes += test_program("Test 1.2", [1, 0, 0, 0, 99], "2, 0, 0, 0, 99");
    passes += test_program("Test 1.3", [2, 3, 0, 3, 99], "2, 3, 0, 6, 99");
    passes += test_program("Test 1.4", [2, 4, 4, 5, 99, 0], "2, 4, 4, 5, 99, 9801");
    passes += test_program("Test 1.5", [1, 1, 1, 4, 99, 5, 6, 0, 99], "30, 1, 1, 4, 2, 5, 6, 0, 99");
    document.getElementById("tests2").innerHTML = `${passes} tests of 5 passed`
}


export { run_day2, tests_day2 };