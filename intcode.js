import { test_assert } from "./utils.js";

// Helper for simple array-based inputs

export function *arrayInputGenerator(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield arr[i];
    }    
}

export class IntCode {
    constructor(program, inputGenerator) {
        // Initialize memory with a copy of the program
        this.memory = program.slice()
        // Inputs.  This is an iterable that may be asynchronous.
        this.inputGenerator = inputGenerator
        this.outputs = []
        this.programCounter = 0
    }

    read_operands(numOperands, modes) {
        let operands = [];
        for (let i = 0; i < numOperands; i++) {
            let value = this.readProgramCounter()
            if (modes[i] == 1) {
                operands.push(value)
            } else {
                operands.push(this.readMemoryAddress(value))
            }
        }

        return operands;
    }

    readProgramCounter() {
        let res= this.readMemoryAddress(this.programCounter)
        this.programCounter += 1;
        return res
    }
    
    readMemoryAddress(address) {
        let res = parseInt(this.memory[address])
        if (isNaN(res)) {            
            throw `Invalid operand at address ${address}: ${this.memory[address]}`
        }
        
        return res;
    }

    /// Run the program.  
    async run(program) {
        // Prevent infinte loops...
        const MAX_COUNTER = 50000;

        while (this.programCounter < MAX_COUNTER) {
            let instruction = this.readProgramCounter();            
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
                    operands = this.read_operands(2, modes);                   
                    // For output, read the value, not what's at the address
                    outputAddr = this.read_operands(1, [1]);                  
                    // console.debug("Addition", addOperands, outputAddr, modes)
                    this.memory[outputAddr] = operands[0] + operands[1];
                    break;
                case 2:
                    // Multiplication
                    operands = this.read_operands(2, modes);
                    // For output, read the value, not what's at the address
                    outputAddr = this.read_operands(1, [1]);
                    // console.debug("Multiplication", multOperands, outputAddr, modes)
                    this.memory[outputAddr] = operands[0] * operands[1];
                    break;
                case 3:
                    // Read input
                    // For a store parameter, read the value, not what's at the address
                    outputAddr = this.read_operands( 1, [1])[0];
                    this.memory[outputAddr] = await this.inputGenerator.next().value;                    
                    // console.debug("Input was", this.memory[outputAddr])
                    break;
                case 4:
                    // Write output 
                    operands = this.read_operands(1, modes);
                    // console.debug("Output", outputAddr)
                    this.outputs.push(operands[0]);
                    
                    break;
                case 5:
                    // Jump-if-true
                    operands = this.read_operands(2, modes)
                    
                    if (operands[0]) {
                        this.programCounter = operands[1];
                    }
                    break;
                case 6:
                    // Jump if false
                    operands = this.read_operands(2, modes)
                    
                    if (!operands[0]) {
                        this.programCounter = operands[1];
                    }
                    break;
                case 7:
                    // Less-than
                    operands = this.read_operands(2, modes)
                    
                    outputAddr = this.read_operands(1, [1])                    
                    if (operands[0] < operands[1]) {
                        this.memory[outputAddr] = 1;
                    } else {
                        this.memory[outputAddr] = 0;
                    }
                    break;
                case 8:
                    // Equality
                    operands = this.read_operands(2, modes)                    
                    outputAddr = this.read_operands(1, [1])                    
                    if (operands[0] == operands[1]) {
                        this.memory[outputAddr] = 1;
                    } else {
                        this.memory[outputAddr] = 0;
                    }
                    break;
                case 99:
                    console.debug("Halt")
                    return;
                default:
                    console.error("Unexpected opcode", opcode)
                    throw `Unexpected opcode!`;
                    break;
            }

        }
    }
}

export function test_program(desc, program, expected) {
    let computer = new IntCode(program, [])
    computer.run()
    return test_assert(desc, computer.memory.join(", "), expected)
}