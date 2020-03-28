import { read_text_input, test_assert } from "./utils.js";
import { run_program, test_program } from "./intcode.js";

// Run a single amplifier and return it's output
function runAmplifier(program, input, phase) {
    return run_program(program, [phase, input])
}

// Run the sequence of amplifiers
function runAmplifierChain(program, phases) {
    if (phases.length != 5) {
        throw `Invalid phase input ${phases} - expect 5 numbers`
    }
    
    let input = 0;

    for (let i = 0; i < phases.length; i++) {
        input = runAmplifier(program, input, phases[i])    
    }
    return input
}

function findMaxPhaseSetting(program) {
    
    function *findPerms(list) {
        for (let i = 0; i < list.length; i++) {
            const value = list[i];  
            // console.debug("Have value", value)
            let rest = list.slice()
            rest.splice(i, 1)
            // console.debug("Rest", rest)
            if (rest.length == 0) {
                yield [value]
            }
            else {
                for (const recursed of findPerms(rest)) {
                    yield [value].concat(recursed)
                }
            }
        }
    }
    
    // Check all possible phase settings.
    const phaseValues = [0, 1, 2, 3, 4];
    let maxSoFar = 0;
    let maxPerm = phaseValues;
    for (const permutation of findPerms(phaseValues)) {
        console.debug("Trying permutation", permutation)
        let out = parseInt(unAmplifierChain(program, permutation))
        if (out  > maxSoFar) {
            console.log("new best output", out)
            maxSoFar = out
            maxPerm = permutation
        }
    }
    
    return [maxPerm, maxSoFar]

}

function run_day7() {
    read_text_input("inputs/day7.txt", (input) => {
        const program = input.split(",")
        // Try all possible combinations of phases.
        let result = findMaxPhaseSetting(program)

        document.getElementById("day7").innerHTML = `Result: ${result[1]}, Phase Settings: ${result[0]}`;
    })
}

function tests_day7() {
    let passes = 0;
    passes += test_assert("1.1", findMaxPhaseSetting([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0])[1], 43210)
    passes += test_assert("1.2", findMaxPhaseSetting([3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0])[1], 54321)
    passes += test_assert("1.3", findMaxPhaseSetting([3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0])[1], 65210)
    document.getElementById("tests7").innerHTML = `${passes}/3 tests passed!`;

}

export { run_day7, tests_day7 };