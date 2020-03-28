import { read_text_input, test_assert } from "./utils.js";
import { test_program, IntCode, arrayInputGenerator } from "./intcode.js";

// Run the sequence of amplifiers
async function runAmplifierChain(program, phases, feedbackMode) {
    if (phases.length != 5) {
        throw `Invalid phase input ${phases} - expect 5 numbers`
    }

    if (feedbackMode) {
        // Loop the amps in a chain. 
        let ampInputGenerator = async function *(prevAmp, phase) {
            // if this is the first amp, the first input is the phase
            yield phase
            let idx = 0
            yield prevAmp.outputs.next()
        }

        let amplifiers = []
        for (let i = 0; i < phases.length; i++) {
            amplifiers.push(new IntCode(program, null))
        }
        // Now link all the implifiers up.
        amplifiers.forEach((amp, idx) => {
            let prevAmp = (idx - 1) % phases.length;            
            amp.inputGenerator = ampInputGenerator(amplifiers[prevAmp], phases[idx])
            await amp.run()
        })
    } else {
        // Run one loop.    
        let nextInput = 0
        for (let i = 0; i < phases.length; i++) {
            let amp = new IntCode(program, arrayInputGenerator([phases[i], nextInput]))
            await amp.run()
            nextInput = amp.outputs[0]
        }
        return nextInput
    }
}

async function findMaxPhaseSetting(program, feedbackMode) {

    function* findPerms(list) {
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
    let phaseValues = [];
    if (feedbackMode) {
        phaseValues = [5, 6, 7, 8, 9];
    } else {
        phaseValues = [0, 1, 2, 3, 4];
    }
    let maxSoFar = 0;
    let maxPerm = phaseValues;
    for (const permutation of findPerms(phaseValues)) {
        console.debug("Trying permutation", permutation)
        let out = parseInt(await runAmplifierChain(program, permutation, feedbackMode))
        if (out > maxSoFar) {
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
        findMaxPhaseSetting(program).then(result => document.getElementById("day7").innerHTML = `Result: ${result[1]}, Phase Settings: ${result[0]}`)
    })
}

function tests_day7() {
    Promise.all([
        findMaxPhaseSetting([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], false).then(res => test_assert("1.1", res[1], 43210)),
        findMaxPhaseSetting([3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0], false).then(res => test_assert("1.2", res[1], 54321)),
        findMaxPhaseSetting([3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0], false).then(res => test_assert("1.3", res[1], 65210))
    ]).then(results => {
        let passes = results.reduce((sum, cur) => sum + cur, 0);
        document.getElementById("tests7").innerHTML = `${passes}/3 tests passed!`;
    })

}

export { run_day7, tests_day7 };