// AoC Day 1.

import { read_text_input, test_assert} from "./utils.js";

// Calculate fule totals
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

function tests_day1() {
    // Tests from the description.
    let passes = 0;
    passes += test_assert("Test 1.1", calc_fuel(12, false), 2);
    passes += test_assert("Test 1.2", calc_fuel(14, false), 2);
    passes += test_assert("Test 1.3", calc_fuel(1969, false), 654);
    passes += test_assert("Test 1.4", calc_fuel(100756, false), 33583);

    passes += test_assert("Test 2.2", calc_fuel(14, true), 2);
    passes += test_assert("Test 2.3", calc_fuel(1969, true), 966);
    passes += test_assert("Test 2.4", calc_fuel(100756, true), 50346);
    document.getElementById("tests1").innerHTML = `${passes} tests of 7 passed`

}

function run_day1() {
    read_text_input("inputs/day1.txt", (input) => {
        var masses = input.split("\n");
        // console.debug(masses.length + " days of input");
        let fuel = calc_fuel_totals(masses, false);
        let fixed_fuel = calc_fuel_totals(masses, true);
        document.getElementById("day1").innerHTML = "Total fuel is <b>" + fuel + "</b>.  Adjusted for Part 2: <b>" + fixed_fuel + "</b>";
    })
}

export { run_day1, tests_day1 };
