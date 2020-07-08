import { read_text_input, test_assert } from "./utils.js";
import { IntCode, arrayInputGenerator } from "./intcode.js";

function run_day9() {
    read_text_input("inputs/day9.txt", (input) => {
        let program = input.split(",");
        let boostTest = new IntCode(program, arrayInputGenerator([1]), "BOOST program: test")
        let boostBoost = new IntCode(program, arrayInputGenerator([2]), "BOOST program: boost")
        Promise.all([boostTest.run(), boostBoost.run()]).then(() => {            
            document.getElementById("day9").innerHTML = `BOOST test mode output: ${boostTest.outputs}, Sensort output: ${boostBoost.outputs}`;
       })
    })
}

async function runProgramAndCheckOutput(desc, program, input, expected) {
    // console.log("Running program with input", program,  input)
    let computer = new IntCode(program, arrayInputGenerator([input]))
    await computer.run()
    console.log("Test outputs", computer.outputs)
    return test_assert(desc, computer.outputs[0], expected)
}

function tests_day9() {
    let passes = 0;
    Promise.all([
      runProgramAndCheckOutput("1.1",  [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99], [], 109),
      runProgramAndCheckOutput("1.2",  [1102,34915192,34915192,7,4,7,99,0], [], 1219070632396864),
      runProgramAndCheckOutput("1.3",  [104,1125899906842624,99], [], 1125899906842624),
    ]).then(results => {
        passes += results.reduce((sum, cur) => sum +cur, 0);
        document.getElementById("tests9").innerHTML = `${passes}/3 tests passed!`;
    })

}

export { run_day9, tests_day9 };