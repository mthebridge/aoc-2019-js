const TESTING = false;

function read_text_input(file, callback) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status < 400) {
            console.debug("Read text input OK");
            callback(xhttp.responseText)
        }

    }
    // xhttp.overrideMimeType("text/plain");
    xhttp.open("GET", file, true);
    xhttp.send()

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

    read_text_input("./day1.txt", function (input) {
        var masses = input.split("\n");
        console.debug(masses.length + " days of input");
        let fuel = calc_fuel_totals(masses, false);
        let fixed_fuel = calc_fuel_totals(masses, true);
        document.getElementById("day1").innerHTML = "Day 1 Part 1: Total fuel is <b>" + fuel + "</b>.  Adjusted for Part2: <b>" + fixed_fuel + "</b>";
        //   var day2_pt2 = "<unknown>";
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

function run_puzzles() {
    console.log("Running Day 1...");
    day1()
    console.log("Day1 complete!");
}

initialize()
run_puzzles()

if (TESTING) {
    run_tests()
}