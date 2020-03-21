import { test_assert } from "./utils.js";

/// Run the program.  Returns the outputs as an array.
export function run_program(program, inputs) {
    // Prevent infinte loops...
    const MAX_COUNTER = 5000;

    function read_position(program, counter) {
        let res = parseInt(program[counter])
        if (isNaN(res)) {
            alert("Invalid operand", res)
        }
        return res;
    }

    function read_operands(program, counterAddress, numOperands, modes) {
        let operands = [];
        for (let i = 0; i < numOperands; i++) {
            let value = read_position(program, counterAddress + i)
            if (modes[i] == 1) {
                operands.push(value)
            } else {
                operands.push(read_position(program, value))
            }

        }

        return operands;
    }

    let counter = 0;
    let outputs = [];
    let inputIdx = 0;
    while (counter < MAX_COUNTER) {
        let instruction = read_position(program, counter);
        counter += 1;
        //console.debug("Opcode:", opcode)
        let opcode = instruction % 100;
        let modes = []
        let operands;
        let outputAddr;
        let ret = Math.floor(instruction / 100);
        while (ret > 0) {
            modes.push(ret % 10);
            ret = Math.floor(ret / 10)
        }

        switch (opcode) {
            case 1:
                // Addition
                operands = read_operands(program, counter, 2, modes);
                counter += 2;
                // For output, read the value, not what's at the address
                outputAddr = read_operands(program, counter, 1, [1]);
                counter += 1;
                // console.debug("Addition", addOperands, outputAddr, modes)
                program[outputAddr] = operands[0] + operands[1];
                break;
            case 2:
                // Multiplication
                operands = read_operands(program, counter, 2, modes);
                counter += 2;
                // For output, read the value, not what's at the address
                outputAddr = read_operands(program, counter, 1, [1]);
                counter += 1;
                // console.debug("Multiplication", multOperands, outputAddr, modes)
                program[outputAddr] = operands[0] * operands[1];
                break;
            case 3:
                // Read input
                // For a store parameter, read the value, not what's at the address
                outputAddr = read_operands(program, counter, 1, [1])[0];
                // console.debug("Input", inputAddr)
                program[outputAddr] = inputs[inputIdx++];
                counter += 1;
                break;
            case 4:
                // Write output 
                operands = read_operands(program, counter, 1, modes);
                // console.debug("Output", outputAddr)

                outputs.push(operands[0]);

                counter += 1;
                break;
            case 5:
                // Jump-if-true
                operands = read_operands(program, counter, 2, modes)
                counter += 2;
                if (operands[0]) {
                    counter = operands[1];
                }
                break;
            case 6:
                // Jump if false
                operands = read_operands(program, counter, 2, modes)
                counter += 2;
                if (!operands[0]) {
                    counter = operands[1];
                }
                break;
            case 7:
                // Less-than
                operands = read_operands(program, counter, 2, modes)
                counter += 2;
                outputAddr = read_operands(program, counter, 1, [1])
                counter += 1;
                if (operands[0] < operands[1]) {
                    program[outputAddr] = 1;
                } else {
                    program[outputAddr] = 0;
                }
                break;
            case 8:
                // Equality
                operands = read_operands(program, counter, 2, modes)
                counter += 2;
                outputAddr = read_operands(program, counter, 1, [1])
                counter += 1;
                if (operands[0] == operands[1]) {
                    program[outputAddr] = 1;
                } else {
                    program[outputAddr] = 0;
                }
                break;
            case 99:
                console.debug("Halt")
                return outputs;
            default:
                console.error("Unexpected opcode", opcode)
                alert(`Unexpected opcode!`);
                break;
        }

    }
}

export function test_program(desc, program, expected) {
    run_program(program);
    return test_assert(desc, program.join(", "), expected)
}