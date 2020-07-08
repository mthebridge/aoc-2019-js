// Replace 10 with the day number, then rename and save.
// Solutions for AoC day 10
import { read_text_input, assert } from "./utils.js";


class Map {
    constructor(input) {
        // Populate the list of asteroids
        let rows = input.split("\n")
        this.height = rows.length;
        this.width = rows[0].length;
        this.map = [];
        this.asteroids = [];

        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            for (let c = 0; c < row.length; c++) {
                // This will index the point in the map  by (row * width) + column.                
                if (row.charAt(c) == '#') {
                    this.map.push(true)
                    this.asteroids.push(new Asteroid(c, r));
                } else {
                    this.map.push(false)
                }
            }
        }
    }

    isAsteroid(x, y) {
        let pointIdx = (y * this.width) + x;
        return this.map[pointIdx]
    }


    countVisibilities() {
        for (let a = 0; a < this.asteroids.length; a++) {
            let astA = this.asteroids[a]
            for (let b = a + 1; b < this.asteroids.length; b++) {
                let astB = this.asteroids[b]
                if (checkVisibility(astA, astB, this)) {
                    astA.visibles.push(astB);
                    astB.visibles.push(astA);
                }
            }
        }
    }

    findBestStation() {
        let max = 0;
        let best = null;
        this.asteroids.forEach(asteroid => {
            const thisLen = asteroid.visibles.length;
            if (thisLen > max) {
                max = thisLen;
                best = asteroid;
            }
        });

        return best
    }
}

class Asteroid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visibles = []
    }
}

// Check if asteroid A visible from B.
function checkVisibility(a, b, map) {
    // console.debug(`Checking visibility from (${a.x}, ${a.y}) to (${b.x}, ${b.y})`); // 6,3 to 0,7
    let xdiff = a.x - b.x;  // 6
    let ydiff = a.y - b.y;  // -4

    // The asteroid is visible *unless* another blocks it.
    // For there to be an asteroid that blocks it, intermediate points on the map
    // must be asteroids.         
    if (xdiff == 0) {
        // Same column
        for (let i = 1; i < Math.abs(ydiff); i++) {
            if (map.isAsteroid(b.x, Math.min(a.y, b.y) + i)) {
                // console.debug(`Line blocked by (${a.x}, ${Math.min(a.y, b.y) + i})`);
                return false;
            }
        }
    } else if (ydiff == 0) {
        for (let i = 1; i < Math.abs(xdiff); i++) {
            if (map.isAsteroid(Math.min(a.x, b.x) + i, b.y)) {
                // console.debug(`Line blocked by (${Math.min(a.x, b.x) + i}, ${a.y})`);
                return false;
            }
        }
    } else {
        // Not samw row or column.  
        // Any blockers must be positioned on a straight line bwteen the two points.
        // the set of blockers between (x1, y1) and (x2, y2) are at:
        //   (x1 + i, y1 + i)
        // for all i s.t  |x1 - y1| and |x2 - y2| are positive integer multiples of i        
        let range;
        let xmult = 0;
        let ymult = 0;
        let foundMult = false;
        let mindiff;

        if (Math.abs(xdiff) > Math.abs(ydiff)) {
            // Closer on y-axis.            
            mindiff = Math.abs(ydiff);
        } else {
            // Closer on x-axis (or same).            
            mindiff = Math.abs(xdiff);
        }

        // We want to minimize the dvisor, so work downwards...
        for (let i = mindiff; i > 1; i--) {
            xmult = (xdiff / i);
            ymult = (ydiff / i);
            if (Number.isInteger(xmult) && Number.isInteger(ymult)) {
                foundMult = true;
                range = i;
                break;
            }
        }
        if (!foundMult) {
            // No possible blockers.
            return true
        }

        //xmult = 3, ymult == -2, range = 4

        // The X and Y ratios share an integer multiple.  We need to check all possible spots between them.        
        for (let i = 1; i < range; i++) {
            const testx = b.x + (xmult * i);
            const testy = b.y + (ymult * i);

            // console.debug(`Checking (${testx}, ${testy})...`)
            if (map.isAsteroid(testx, testy)) {
                // console.dqebug(`Blocker at (${testx}, ${testy})`);
                return false;
            }
        }
    }
    // No matches - visible.
    return true;
}


function run_day10() {
    read_text_input("inputs/day10.txt", (input) => {
        let map = new Map(input);
        map.countVisibilities();
        let best = map.findBestStation();

        document.getElementById("day10").innerHTML = `Best station is at (${best.x}, ${best.y}) - ${best.visibles.length} asteroids in sight`;
    })
}

function test_part1(idx, input, x, y, max) {
    console.log(`Running test 1.${idx}`)
    let map = new Map(input);
    map.countVisibilities();
    let best = map.findBestStation();
    return (assert(best.x, x) && assert(best.y, y) && assert(best.visibles.length, max))

}

function tests_day10() {
    let passes = 0;

    passes += test_part1(1,
        [".#..#",
            ".....",
            "#####",
            "....#",
            "...##"].join("\n"),
        3, 4, 8
    )

    passes += test_part1(2,
        ["......#.#.",
            "#..#.#....",
            "..#######.",
            ".#.#.###..",
            ".#..#.....",
            "..#....#.#",
            "#..#....#.",
            ".##.#..###",
            "##...#..#.",
            ".#....####"].join("\n"), 5, 8, 33);


    passes += test_part1(3,
        ["#.#...#.#.",
            ".###....#.",
            ".#....#...",
            "##.#.#.#.#",
            "....#.#.#.",
            ".##..###.#",
            "..#...##..",
            "..##....##",
            "......#...",
            ".####.###."
        ].join("\n"), 1, 2, 35);

    passes += test_part1(4,
        [".#..#..###",
            "####.###.#",
            "....###.#.",
            "..###.##.#",
            "##.##.#.#.",
            "....###..#",
            "..#.#..#.#",
            "#..#.#.###",
            ".##...##.#",
            ".....#.#.."
        ].join("\n"), 6, 3, 41);

    passes += test_part1(5,
        [
            ".#..##.###...#######",
            "##.############..##.",
            ".#.######.########.#",
            ".###.#######.####.#.",
            "#####.##.#.##.###.##",
            "..#####..#.#########",
            "####################",
            "#.####....###.#.#.##",
            "##.#################",
            "#####.##.###..####..",
            "..######..##.#######",
            "####.##.####...##..#",
            ".#####..#.######.###",
            "##...#.##########...",
            "#.##########.#######",
            ".####.#.###.###.#.##",
            "....##.##.###..#####",
            ".#.#.###########.###",
            "#.#.#.#####.####.###",
            "###.##.####.##.#..##"
        ].join("\n"), 11, 13, 210);

    document.getElementById("tests10").innerHTML = `${passes}/5 tests passed!`;

}

export { run_day10, tests_day10 };