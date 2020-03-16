function read_text_input(file, callback) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.debug("Read text input OK");
            callback(this.responseText)
        }

    }
    xhttp.overrideMimeType("text/plain");
    xhttp.open("GET", file, true);
    xhttp.send()

}

function day1() {
    read_text_input("./day1.txt", function (input) {
        console.debug("Response ready")
        var masses = input.split("\n");
        console.debug(masses.length + " days of input");
        var fuel = 0;
        masses.forEach(m => {
            var mass = parseInt(m);
            console.debug("Next mass = " + mass);
            let this_fuel = Math.floor(m / 3) - 2;
            console.debug("This fuel:" + this_fuel);
            console.debug("Fuel so far: " + fuel)
            fuel = fuel + this_fuel;
        });
        document.getElementById("day1").innerHTML = "Day 1 Part 1: Total fuel is <b>" + fuel + "</b>";
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