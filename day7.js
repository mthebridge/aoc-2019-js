import { read_text_input, test_assert } from "./utils.js";
import { test_program, IntCode, arrayInputGenerator } from "./intcode.js";

async function* ampInputGenerator(prevAmp, phase, isInit) {
    // The first input is the phase
    // console.debug("first input is phase")
    yield phase

    // If this is the first amp, send an init signal
    if (isInit) {
        // console.debug("Initial input signal value is zero")
        yield 0
    }
    
    // Now yield the outputs of the previous amp
    let ourInputs = prevAmp.outputIterator()
    while (true) {
        // console.debug("Waiting for next output from:", prevAmp.name)
        let nextVal = await ourInputs.next()
        if (nextVal.done) {
            // console.debug("No more outputs from: ", prevAmp.name)
            break
        }
        // console.debug("Next output, source", nextVal.value, prevAmp.name)
        yield nextVal.value
    }

}

// Run the sequence of amplifiers
async function runAmplifierChain(program, phases, feedbackMode) {
    if (phases.length != 5) {
        throw `Invalid phase input ${phases} - expect 5 numbers`
    }

    if (feedbackMode) {        
        let amplifiers = []
        let promises = []
        for (let i = 0; i < phases.length; i++) {
            amplifiers.push(new IntCode(program, null, `Ampliifier ${i}`))
        }
        // Now link all the implifiers up.
        for (let i = 0; i < phases.length; i++) {
            let prevAmp = i - 1;
            if (i == 0) {                
                prevAmp = phases.length - 1
            }
            // console.debug("This amp, prev amp", i, prevAmp)
            amplifiers[i].inputGenerator = ampInputGenerator(amplifiers[prevAmp], phases[i], (i == 0))
            promises.push(amplifiers[i].run())
        }
        await Promise.all(promises)
        return amplifiers[amplifiers.length - 1].outputs.pop()
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
        // console.debug("Trying permutation", permutation)
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
        Promise.all([
             findMaxPhaseSetting(program, false),
             findMaxPhaseSetting(program, true),
            ]).then(result => {
               document.getElementById("day7").innerHTML = `Max once: ${result[0][1]} (${result[0][0]}) Max w feedback: ${result[1][1]} (${result[1][0]})`
        })
    })
}

function tests_day7() {
    Promise.all([
        findMaxPhaseSetting([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], false).then(res => test_assert("1.1", res[1], 43210)),
        findMaxPhaseSetting([3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0], false).then(res => test_assert("1.2", res[1], 54321)),
        findMaxPhaseSetting([3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0], false).then(res => test_assert("1.3", res[1], 65210)),
        findMaxPhaseSetting([3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
            27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5], true).then(res => test_assert("2.1", res[1], 139629729)),
        findMaxPhaseSetting([3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
            -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
            53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10], true).then(res => test_assert("2.2", res[1], 18216)),
    ]).then(results => {
        let passes = results.reduce((sum, cur) => sum + cur, 0);
        document.getElementById("tests7").innerHTML = `${passes}/5 tests passed!`;
    })

}

export { run_day7, tests_day7 };