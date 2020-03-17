/// Run the program.  Returns the output as an array.
export function run_program(program) {
    // Prevent infinte loops...
    const MAX_COUNTER = 5000;

    function read_position(program, counter) {
        let res = parseInt(program[counter])
        if (isNaN(res)) {
            alert("Invalid operand", res)
        }
        return res;
    }

    function read_operands(program, first, last) {
        let operands = [];
        for (let i = first; i <= last; i++) {
            operands.push(read_position(program, i))
        }

        return operands;
    }

    let counter = 0;
    while (counter < MAX_COUNTER) {
        let opcode = read_position(program, counter);
        //console.debug("Opcode:", opcode)

        switch (opcode) {
            case 1:
                // console.debug("Addition")
                let addOperands = read_operands(program, counter + 1, counter + 3);
                program[addOperands[2]] = read_position(program, addOperands[0]) + read_position(program, addOperands[1]);
                break;
            case 2:
                // console.debug("Multiplication")
                let multOperands = read_operands(program, counter + 1, counter + 3);
                program[multOperands[2]] = read_position(program, multOperands[0]) * read_position(program, multOperands[1]);
                break;
            case 99:
                // console.debug("Halt")
                return;
            default:
                alert(`Unexpected opcode ${opcode}`);
                break;
        }
        counter += 4;
    }
}
