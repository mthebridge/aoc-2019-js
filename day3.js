import { read_text_input, test_assert } from "./utils.js";

// Convert the path into a set of points that the path covers
//
// For speed store the coordinate as a 32-bt number - top 16 bits x,
// bottom 16.  So that requires 2^16 as a multiplier.

async function parseWirePath(input) {
    let cursor = {x: 0, y: 0};
    let path = [];
    let distance = 1;
    input.split(",").forEach(step => {
        let dir = step.slice(0, 1);
        let len = parseInt(step.slice(1));
        // console.debug(" paths[0][Next direction", dir, len);
        switch (dir) {
            case "R":
                for (let i = 1; i <= len; i++) {
                    path.push({ value: ((cursor.x + i) << 16) + cursor.y, distance: distance++})
                }
                cursor.x += len;
                break;
            case "L":
                for (let i = 1; i <= len; i++) {
                    path.push({ value: ((cursor.x - i) << 16) + cursor.y, distance: distance++})
                }
                cursor.x -= len;
                break;
            case "U":
                for (let i = 1; i <= len; i++) {
                    path.push({ value: (cursor.x << 16) + cursor.y + i, distance: distance++})
                }
                cursor.y += len;
                break;
            case "D":
                for (let i = 1; i <= len; i++) {
                    path.push({ value: (cursor.x << 16) + cursor.y - i, distance: distance++})
                }
                cursor.y -= len;
                break;
            default:
                alert(`Invalid direction ${dir}`);
                break;
        }
    });
    console.debug("Paths are:", path);
    return path.sort((a, b) => a.value - b.value);
}

async function findCrossings(wire1, wire2) {
    let path1Promise = parseWirePath(wire1);
    let path2Promise = parseWirePath(wire2);
    let paths = await Promise.all([path1Promise, path2Promise]);
    // Sort the paths and iterate over them.
    let i = 0, j= 0;
    let crossings = [];
    while ((i < paths[0].length) && (j < paths[1].length)) {
        let valA = paths[0][i].value;
        let valB = paths[1][j].value;
        if (valA < valB) {
            i++;
        }
        if (valA > valB) {
            j++;
        }
        if (valA == valB) {
            //Match!  The "distance" in each path is 1 more than the index
            crossings.push({ distanceA: paths[0][i].distance, distanceB: paths[1][j].distance, value: valA })
            i++;
            j++;
        }
    }
    console.debug("Crossing points are", crossings);
    return crossings
}

async function findClosestCrossingPoint(wire1, wire2) {
    // Now find the intersections.
    let crossings = await findCrossings(wire1, wire2);
    let distances = crossings.map(pt => (parseInt(pt.value >>> 16) + parseInt(pt.value & 0xFFFF))).sort((a, b) => a - b)
    return distances[0]
}

async function findMinimalCrossingSteps(wire1, wire2) {
    let crossings = await findCrossings(wire1, wire2);
    let distances = crossings.map(pt => pt.distanceA + pt.distanceB).sort((a, b) => a - b)
    return distances[0]
}

function run_day3() {
    read_text_input("inputs/day3.txt", (input) => {
        // Might as well parse both input
        let wires = input.split("\n");
        Promise.all([findClosestCrossingPoint(wires[0], wires[1]), findMinimalCrossingSteps(wires[0], wires[1])])
            .then((result) => {
                document.getElementById("day3").innerHTML = `Taxicab minimal distance <b>${result[0]}</b>. Minmal steps <b>${result[1]}</b>`;
            })
    })
}

/// Tests for basic wire crossing.
async function tests_day3() {
    let passes = 0;
    passes += test_assert("Test 1.1", await findClosestCrossingPoint("R8,U5,L5,D3", "U7,R6,D4,L4"), 6);
    passes += test_assert("Test 1.2", await findClosestCrossingPoint("R75,D30,R83,U83,L12,D49,R71,U7,L72", "U62,R66,U55,R34,D71,R55,D58,R83"), 159);
    passes += test_assert("Test 1.3", await findClosestCrossingPoint("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
        "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"), 135);
    passes += test_assert("Test 2.1", await findMinimalCrossingSteps("R8,U5,L5,D3", "U7,R6,D4,L4"), 30);
    passes += test_assert("Test 2.2", await findMinimalCrossingSteps("R75,D30,R83,U83,L12,D49,R71,U7,L72", "U62,R66,U55,R34,D71,R55,D58,R83"), 610);
    passes += test_assert("Test 2.3", await findMinimalCrossingSteps("R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
        "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"), 410);
    document.getElementById("tests3").innerHTML = `${passes}/6 tests passed`;
}


export { run_day3, tests_day3 };