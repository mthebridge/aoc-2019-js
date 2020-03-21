import { read_text_input, test_assert } from "./utils.js";

const MIN_VALUE = 236491
const MAX_VALUE = 713787

// Is a password valid, assuming in range
function isPassValid(pass, noLongPairs) {
    let seen_pair = false;
    let maybe_pair = false;
    let last;
    let cur_rep_len = 1;
    for (let char of pass) {
        let c = parseInt(char);
        if (last != undefined && c < last) {
            // Decreasing
            return false
        }
        if (last == c) {
            // Same as the last char.
            cur_rep_len++;
            if (cur_rep_len > 2 && noLongPairs) {
                // Was already a pair - this is the third char.
                maybe_pair = false
            } else {
                maybe_pair = true;
            }
        } else {
            // Not in a repetition
            cur_rep_len = 1;
            if (maybe_pair) {
                seen_pair = true;
            }
        }
        last = c
    }

    return (seen_pair || maybe_pair)

}

function run_day4() {
    let numValid1 = 0;
    let numValid2 = 0;

    for (let thisPass = MIN_VALUE; thisPass <= MAX_VALUE; thisPass++) {
        numValid1 += isPassValid(thisPass.toString(), false);
        numValid2 += isPassValid(thisPass.toString(), true);
    }
    document.getElementById("day4").innerHTML = `Valid passwords in range: ${numValid1}, part2: ${numValid2}`;
}

function tests_day4() {
    let passes = 0;
    passes += test_assert("1.1", isPassValid("111111", false), true);
    passes += test_assert("1.2", isPassValid("223450", false), false);
    passes += test_assert("1.3", isPassValid("123789", false), false);
    passes += test_assert("1.4", isPassValid("123444", false), true);
    passes += test_assert("2.1", isPassValid("112233", true), true);
    passes += test_assert("2.2", isPassValid("123444", true), false);
    passes += test_assert("2.3", isPassValid("111122", true), true);
    passes += test_assert("2.4", isPassValid("112222", true), true);
    passes += test_assert("2.5", isPassValid("111111", true), false);

    document.getElementById("tests4").innerHTML = `${passes}/9 tests passed`;
}

export { run_day4, tests_day4 };
