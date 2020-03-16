const TESTING = true;

function read_text_input(file, callback) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status < 400) {
            // console.debug("Read text input OK");
            callback(xhttp.responseText)
        }
    }
    xhttp.open("GET", file, true);
    xhttp.send()
}

function test_assert(desc, a, b) {
    console.log("Running test: " + desc)
    if (a != b) {
        console.log("TEST FAILED:" + a + "!=" + b)
    } else {
        console.log("Test passed!")
    }
}

function day1() {
    function calc_fuel(mass, recurse) {
        let m = parseInt(mass);
        // console.debug("Mass " + m)
        let thisFuel = Math.max(Math.floor(m / 3) - 2, 0);
        var moduleFuel = thisFuel;
        if (recurse && thisFuel > 0) {
            moduleFuel += calc_fuel(moduleFuel, true)
        }
        return moduleFuel;
    };

    function calc_fuel_totals(masses, recurse) {
        var fuel = 0;
        masses.forEach(m => {
            // console.debug("Next mass = " + m);
            fuel += calc_fuel(m, recurse);
        });
        return fuel
    };

    if (TESTING) {
        // Tests from the description.
        test_assert("Test 1.1.1", calc_fuel(12, false), 2);
        test_assert("Test 1.1.2", calc_fuel(14, false), 2);
        test_assert("Test 1.1.3", calc_fuel(1969, false), 654);
        test_assert("Test 1.1.4", calc_fuel(100756, false), 33583);

        test_assert("Test 1.2.2", calc_fuel(14, true), 2);
        test_assert("Test 1.2.3", calc_fuel(1969, true), 966);
        test_assert("Test 1.2.4", calc_fuel(100756, true), 50346);
    }

    read_text_input("inputs/day1.txt", (input) => {
        var masses = input.split("\n");
        // console.debug(masses.length + " days of input");
        let fuel = calc_fuel_totals(masses, false);
        let fixed_fuel = calc_fuel_totals(masses, true);
        document.getElementById("day1").innerHTML = "Day 1: Total fuel is <b>" + fuel + "</b>.  Adjusted for Part 2: <b>" + fixed_fuel + "</b>";
    })

}

function initialize(days = 25) {
    var results = document.createElement("div");
    for (let i = 1; i <= days; i++) {
        let dayname = "day" + i;
        var newDiv = document.createElement("div");
        newDiv.class = "day";
        newDiv.id = dayname;
        let out = document.createTextNode("Day " + i + ": UNKNOWN");
        newDiv.appendChild(out);
        results.appendChild(newDiv);
    }

    document.body.appendChild(results)
}

function day2() {
    // Run the program.  Returns the output as an array.
    function run_program(program) {
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
            // console.debug("Opcode:", opcode)

            switch (opcode) {
                case 1:
                    // console.debug("Addition")
                    let addOperands = read_operands(program, counter +1, counter + 3);
                    program[addOperands[2]] = read_position(program, addOperands[0]) + read_position(program, addOperands[1]);
                    break;
                case 2:
                    // console.debug("Multiplication")
                    let multOperands = read_operands(program, counter + 1, counter + 3);
                    program[multOperands[2]] = read_position(program, multOperands[0]) * read_position(program, multOperands[1]);
                    break;
                case 99:
                    console.debug("Halt")
                    return program;
                default:
                    alert("Unexpected opcode!", opcode);
                    break;
            }
            counter += 4;
        }

    }

    read_text_input("inputs/day2.txt", (input) => {
        let program = input.split(",");
        program[1] = 12;
        program[2] = 2;
        let result = run_program(program);
        document.getElementById("day2").innerHTML = "Day 2: Program position output <b>" + result[0] + "</b>";

        //
    })

    if (TESTING) {
        test_assert("Test 2.1.1",
            run_program([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]).join(", "),
            "3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50");
        test_assert("Test 2.1.2", run_program([1, 0, 0, 0, 99]).join(", "), "2, 0, 0, 0, 99");
        test_assert("Test 2.1.2", run_program([2, 3, 0, 3, 99]).join(", "), "2, 3, 0, 6, 99");
        test_assert("Test 2.1.3", run_program([2, 4, 4, 5, 99, 0]).join(", "), "2, 4, 4, 5, 99, 9801");
        test_assert("Test 2.1.4", run_program([1, 1, 1, 4, 99, 5, 6, 0, 99]).join(", "),"30, 1, 1, 4, 2, 5, 6, 0, 99");
    }

}

function run_puzzles() {
    day1()
    day2()
}

initialize()
run_puzzles()
