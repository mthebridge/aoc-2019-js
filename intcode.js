import { test_assert } from "./utils.js";

// Helper for simple array-based inputs

export function* arrayInputGenerator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}

export class IntCode {
  constructor(program, inputGenerator, name) {
    // Initialize memory with a copy of the program
    this.memory = program.slice();
    // Inputs.  This is an iterable that may be asynchronous.
    this.inputGenerator = inputGenerator;
    this.outputs = [];
    this.programCounter = 0;
    this.halted = false;
    this.name = name;
    this.relativeBase = 0;
  }

  // For an *output* parameter, we want to return the *address* rather than the value
  read_output_address(mode) {
    let value = this.readProgramCounter();
    switch (mode) {
      case 1:
         throw "Immediate mode not valid for addresses"
      case 2:
        // Add the relative base.
        // console.debug("Base, value, sum:", this.relativeBase, value, this.relativeBase + value)
        return this.relativeBase + value  
      default:
        return value;        
    }      
  }

  read_operands(numOperands, modes) {
    let operands = [];
    for (let i = 0; i < numOperands; i++) {
      let value = this.readProgramCounter();
      switch (modes[i]) {          
        case 1:
           operands.push(value);
           break;
        case 2:
          // Add the relative base.
          operands.push(this.readMemoryAddress(this.relativeBase + value));
          break;
        default:
          operands.push(this.readMemoryAddress(value));
          break
        
      }
    }

    return operands;
  }

  readProgramCounter() {
    let res = this.readMemoryAddress(this.programCounter);
    this.programCounter += 1;
    return res;
  }

  readMemoryAddress(address) {
    if (address < 0) {
      throw `${this.name} Cannot access negative address ${address}`
    }
    if (address >= this.memory.length) {
      // Memory not yet accessed - initialize to zero.
      this.memory[address] = 0;
    }
    let res = parseInt(this.memory[address]);
    if (isNaN(res)) {
      throw `${this.name}: Invalid operand at address ${address}: ${this.memory[address]}`;
    }

    return res;
  }

  /// Run the program.
  async run(program) {
    // Prevent infinte loops...
    const MAX_COUNTER = 50000;

    while (this.programCounter < MAX_COUNTER) {
      let instruction = this.readProgramCounter();
      let opcode = instruction % 100;
      // console.debug(`${this.name}: Opcode:`, opcode)
      let modes = [];
      let operands;
      let outputAddr;
      let ret = Math.floor(instruction / 100);
      while (ret > 0) {
        modes.push(ret % 10);
        ret = Math.floor(ret / 10);
      }
      // console.debug(`${this.name}: Modes:`, modes)

      switch (opcode) {
        case 1:
          // Addition
          operands = this.read_operands(2, modes);
          // For output, read the value, not what's at the address
          outputAddr = this.read_output_address(modes[2]);
          // console.debug("Addition", operands, outputAddr, modes)
          this.memory[outputAddr] = operands[0] + operands[1];
          break;
        case 2:
          // Multiplication
          operands = this.read_operands(2, modes);
          // For output, read the value, not what's at the address
          outputAddr = this.read_output_address(modes[2]);
          // console.debug("Multiplication", operands, outputAddr, modes)
          this.memory[outputAddr] = operands[0] * operands[1];
          break;
        case 3:
          // Read input
          // For a store parameter, read the value, not what's at the address
          outputAddr = this.read_output_address(modes[0]);
          // console.log(`${this.name}:  Try to read input, address: ${outputAddr}`)
          let nextInput = await this.inputGenerator.next();
          // console.log(`${this.name}:  Next input`, nextInput)
          if (nextInput.done) {
            throw "No more inputs";
          } else {
            this.memory[outputAddr] = nextInput.value;
          }
          // console.debug("Input was", this.memory[outputAddr])
          break;
        case 4:
          // Write output
          operands = this.read_operands(1, modes);
          // console.debug(`${this.name}: Output`, operands[0])
          this.outputs.push(operands[0]);

          break;
        case 5:
          // Jump-if-true
          operands = this.read_operands(2, modes);

          if (operands[0]) {
            this.programCounter = operands[1];
          }
          break;
        case 6:
          // Jump if false
          operands = this.read_operands(2, modes);

          if (!operands[0]) {
            this.programCounter = operands[1];
          }
          break;
        case 7:
          // Less-than
          operands = this.read_operands(2, modes);

          outputAddr = this.read_output_address(modes[2]);
          if (operands[0] < operands[1]) {
            this.memory[outputAddr] = 1;
          } else {
            this.memory[outputAddr] = 0;
          }
          break;
        case 8:
          // Equality
          operands = this.read_operands(2, modes);
          outputAddr = this.read_output_address(modes[2]);
          if (operands[0] == operands[1]) {
            this.memory[outputAddr] = 1;
          } else {
            this.memory[outputAddr] = 0;
          }
          break;
        case 9:
          // Relative base shift
          operands = this.read_operands(1, modes);
          // console.debug("base shift by:", operands[0])
          this.relativeBase += operands[0];
          break;
        case 99:
          // console.debug("Halt")
          this.halted = true;
          return;
        default:
          console.error("Unexpected opcode", opcode);
          throw `Unexpected opcode!`;
          break;
      }
    }
  }
}

export function test_program(desc, program, expected) {
  let computer = new IntCode(program, []);
  computer.run();
  return test_assert(desc, computer.memory.join(", "), expected);
}
