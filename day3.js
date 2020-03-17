import { read_text_input, test_assert } from "./utils.js";

// Convert the path into a set of points that the path covers
//
// For speed store the coordinate as a 32-bt number - top 16 bits x,
// bottom 16 y
async function parseWirePath(input) {
    let cursor = {x: 0, y: 0};
    let path = [];
    input.split(",").forEach(step => {
        let dir = step.slice(0, 1);
        let len = parseInt(step.slice(1));
        // console.debug("Next direction", dir, len);
        switch (dir) {
            case "R":
                for (let i = 1; i <= len; i++) {
                    path.push(((cursor.x + i) << 16) + cursor.y)
                }
                cursor.x += len;
                break;
            case "L":
                for (let i = 1; i <= len; i++) {
                    path.push(((cursor.x - i) << 16) + cursor.y)
                }
                cursor.x -= len;
                break;
            case "U":
                for (let i = 1; i <= len; i++) {
                    path.push((cursor.x << 16) + cursor.y + i)
                }
                cursor.y += len;
                break;
            case "D":
                for (let i = 1; i <= len; i++) {
                    path.push((cursor.x << 16) + cursor.y - i)
                }
                cursor.y -= len;
                break;
            default:
                alert(`Invalid direction ${dir}`);
                break;
        }
    });
    console.debug("Paths are:", path);
    return path;
}

async function getPaths(wire1, wire2) {
    let path1Promise = parseWirePath(wire1);
    let path2Promise = parseWirePath(wire2);
    return Promise.all([path1Promise, path2Promise]);
}

async function findClosestCrossingPoint(wire1, wire2) {
    let paths = await getPaths(wire1, wire2);
    // Now find the intersections.
    let crossings = paths[0].filter(p1 => paths[1].includes(p1));
    let distances = crossings.map(pt => ((pt >>> 16)) + (pt & 0xffff)).sort((a, b) => a - b)
    return distances[0]
}

async function findMinimalCrossingSteps(wire1, wire2) {
    let paths = await getPaths(wire1, wire2);
    let crossSteps = [];
    paths[0].forEach((p1, idx) => {
        let p2idx = paths[1].findIndex(p2 => p1 == p2)
        if (p2idx != -1) {
            // Need to add two as arrays are 0-indexed but we want 1-indexed
            crossSteps.push(idx + p2idx + 2)
        }
    });
    console.debug("Steps to crossing points", crossSteps);

    let distances = crossSteps.sort((a, b) => a - b)
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