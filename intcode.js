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

    function read_operands(program, counterAddress, numOperands) {
        let operands = [];
        for (let i = 0; i <= numOperands; i++) {
            operands.push(read_position(program, counterAddress + i))
        }

        return operands;
    }

    let counter = 0;
    let outputs = [];
    let inputIdx = 0;
    while (counter < MAX_COUNTER) {
        let instruction = read_position(program, counter);
        //console.debug("Opcode:", opcode)
        let opcode = instruction % 100;
        let modes = []
        let ret = Math.floor(instruction / 100);
        while (ret > 0) {
            modes.push(ret % 10);
            ret = Math.floor(ret / 10)
        }
        let op1, op2;

        switch (opcode) {
            case 1:
                let addOperands = read_operands(program, counter + 1, 2);
                console.debug("Addition", addOperands, modes)
                if (modes[0] == 1) { op1 = addOperands[0]; } else { op1 = read_position(program, addOperands[0]); }
                if (modes[1] == 1) { op2 = addOperands[1]; } else { op2 = read_position(program, addOperands[1]); }
                program[addOperands[2]] = op1 + op2;
                counter += 4;
                break;
            case 2:
                let multOperands = read_operands(program, counter + 1, 2);
                console.debug("Multiplication", multOperands, modes)
                if (modes[0] == 1) { op1 = multOperands[0]; } else { op1 = read_position(program, multOperands[0]); }
                if (modes[1] == 1) { op2 = multOperands[1]; } else { op2 = read_position(program, multOperands[1]); }
                program[multOperands[2]] = op1 * op2;
                counter += 4;
                break;
            case 3:
                let inputAddr = read_operands(program, counter + 1, 1)[0];
                console.debug("Input", inputAddr)
                program[inputAddr] = inputs[inputIdx++];
                counter += 2;
                break;
            case 4:
                let outputVal = read_operands(program, counter + 1, 1)[0];
                console.debug("Output", outputVal)
                if (modes[0] == 1) {
                    outputs.push(outputVal);
                } else {
                    outputs.push(program[outputVal]);
                }
                counter += 2;
                break;
            case 99:
                 console.debug("Halt")
                return outputs;
            default:
                alert(`Unexpected opcode ${opcode}`);
                break;
        }

    }
}

export function test_program(desc, program, expected) {
    run_program(program);
    return test_assert(desc, program.join(", "), expected)
}