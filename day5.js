import { read_text_input, test_assert } from "./utils.js";
import { test_program, IntCode, arrayInputGenerator } from "./intcode.js";

function run_day5() {
    read_text_input("inputs/day5.txt", (input) => {
        let program = input.split(",");
        // Part1 - run the TEST program with input 1 (aircon). 
        let AirCon = new IntCode(program, arrayInputGenerator([1]));
        // Part2 - run the TEST program with input 5 (thermals).        
        let Radiator = new IntCode(program, arrayInputGenerator([5]));
        AirCon.run()                  
        Radiator.run()
        Promise.all([AirCon, Radiator]).then(() =>
            document.getElementById("day5").innerHTML = `TEST aircon: ${AirCon.outputs}, TEST Radiator control:${Radiator.outputs}`
        )
    })
}

async function runProgramAndCheckOutput(desc, program, input, expected) {
    // console.log("Running program with input", program,  input)
    let computer = new IntCode(program, arrayInputGenerator(input))
    await computer.run()
    // console.log("Outputs", computer.outputs)
    return test_assert(desc, computer.outputs[0], expected)
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
    let testLessEqualGreaterEight = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
        1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
        999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
    Promise.all([runProgramAndCheckOutput("Test 2.1", testEqualEight1, [8], 1),
      runProgramAndCheckOutput("Test 2.2", testEqualEight2, [8], 1),
      runProgramAndCheckOutput("Test 2.3", testEqualEight1, [7], 0),
      runProgramAndCheckOutput("Test 2.4", testEqualEight1, [-8], 0),
      runProgramAndCheckOutput("Test 2.5", testEqualEight2, [9], 0),
      runProgramAndCheckOutput("Test 2.6", testLessThanEight1, [8], 0),
      runProgramAndCheckOutput("Test 2.7", testLessThanEight1, [7], 1),
      runProgramAndCheckOutput("Test 2.8", testLessThanEight2, [8], 0),
      runProgramAndCheckOutput("Test 2.9", testLessThanEight2, [7], 1),
      runProgramAndCheckOutput("Test 2.10", testLessEqualGreaterEight, [7], 999),
      runProgramAndCheckOutput("Test 2.11", testLessEqualGreaterEight, [8], 1000),
      runProgramAndCheckOutput("Test 2.12", testLessEqualGreaterEight, [9], 1001),
      runProgramAndCheckOutput("Test 2.13", testLessEqualGreaterEight, [-8], 999),
      runProgramAndCheckOutput("Test 2.14", testLessEqualGreaterEight, [88], 1001),
    ]).then(results => {
        passes += results.reduce((sum, cur) => sum +cur, 0);
        document.getElementById("tests5").innerHTML = `Tests ${passes}/15 passed`;
    })
}

export { run_day5, tests_day5 };