import { read_text_input, test_assert } from "./utils.js";

// A point a wire travels through
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isEqual(other) {
        return (this.x == other.x && this.y == other.y)
    }

    originDistance() {
        return (Math.abs(this.x) + Math.abs(this.y))
    }
}

// Convert the path into a set of edges that the path covers
async function parseWirePath(input) {
    let cursor = new Point(0, 0);
    let path = [];
    input.split(",").forEach(step => {
        let dir = step.slice(0, 1);
        let len = parseInt(step.slice(1));
        // console.debug("Next direction", dir, len);
        switch (dir) {
            case "R":
                for (let i = 1; i <= len; i++) {
                    path.push(new Point(cursor.x + i, cursor.y))
                }
                cursor.x += len;
                break;
            case "L":
                for (let i = 1; i <= len; i++) {
                    path.push(new Point(cursor.x - i, cursor.y))
                }
                cursor.x -= len;
                break;
            case "U":
                for (let i = 1; i <= len; i++) {
                    path.push(new Point(cursor.x, cursor.y + i))
                }
                cursor.y += len;
                break;
            case "D":
                for (let i = 1; i <= len; i++) {
                    path.push(new Point(cursor.x, cursor.y - i))
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

async function findClosestCrossingPoint(wire1, wire2) {
    let path1Promise = parseWirePath(wire1);
    let path2Promise = parseWirePath(wire2);
    let paths = await Promise.all([path1Promise, path2Promise]);
    console.log("Paths returned", paths[0], paths[1])
    // Now find the intersections.
    // The naive double-loop is too slow??
    let crossings = paths[0].filter(p1 => paths[1].some(p2 => p1.isEqual(p2)));
    console.debug(`There are ${crossings.length} crossing points`, crossings);
    let distances = crossings.map(pt => pt.originDistance()).sort((a, b) => a - b)
    return distances[0]

}

function run_day3() {
    read_text_input("inputs/day3.txt", (input) => {
        // Might as well parse both input
        let wires = input.split("\n");
        findClosestCrossingPoint(wires[0], wires[1]).then((result) => {
            document.getElementById("day3").innerHTML = `Position output <b>${result}</b>.`;
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
    document.getElementById("tests3").innerHTML = `${passes}/3 tests passed`;
}


export { run_day3, tests_day3 };