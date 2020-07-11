// Replace 12 with the day number, then rename and save.
// Solutions for AoC day 12
import { read_text_input, assert, test_assert } from "./utils.js";

class State {
    constructor(pos, vel) {
        this.pos = pos
        this.vel = vel
    }
}

function getLcm(a, b, c) {

    // Run Euclid to get the gcd then divide the product by this.
    console.log(`Finding LCM of ${a}, ${b}, ${c}`)

    function getGcd(a, b) {
        let r1 = Math.min(a, b)
        let r2 = Math.max(a, b)

        while (r2 != 0) {
            let mod = r1 % r2
            r1 = r2
            r2 = mod
        }
        return  r1

    }

    let abLcm = (a/getGcd(a, b)) * b
    return (abLcm /getGcd(abLcm, c)) * c
}

class Moon {
    constructor(x, y, z) {
        console.log(`New moon at (${x}, ${y}, ${z})`)
        this.x = new State(x, 0)
        this.y = new State(y, 0)
        this.z = new State(z, 0)
    }

    // Update velocity based on another moon
    simulateGravity(other) {
        if (this.x.pos < other.x.pos) {
            this.x.vel += 1;
            other.x.vel -= 1;
        }
        if (this.x.pos > other.x.pos) {
            this.x.vel -= 1;
            other.x.vel += 1;
        }

        if (this.y.pos < other.y.pos) {
            this.y.vel += 1;
            other.y.vel -= 1;
        }
        if (this.y.pos > other.y.pos) {
            this.y.vel -= 1;
            other.y.vel += 1;
        }

        if (this.z.pos < other.z.pos) {
            this.z.vel += 1;
            other.z.vel -= 1;
        }
        if (this.z.pos > other.z.pos) {
            this.z.vel -= 1;
            other.z.vel += 1;
        }
    }

    // update position based on velocity
    simulateVelocity() {
        this.x.pos += this.x.vel
        this.y.pos += this.y.vel
        this.z.pos += this.z.vel
    }


    getEnergy() {
        // Total all absolute positions and velocities
        let potential = Math.abs(this.x.pos) + Math.abs(this.y.pos) + Math.abs(this.z.pos)
        let kinetic =  Math.abs(this.x.vel) + Math.abs(this.y.vel) + Math.abs(this.z.vel)
        console.log(`PE ${potential}, KE ${kinetic}`)
        return potential * kinetic
    }

}

function runSingleTimeStep(moons) {
    // Loop over each moon
    moons.forEach((moon, idx) => {
        // Simulate gravity
        // We don't want to double count, so iterate over all moons after this one.
        let others = moons.slice(idx + 1)
        others.forEach(other => {
            moon.simulateGravity(other)
        })
    })

    // Now velocity
    moons.forEach(moon => {
        moon.simulateVelocity()
    });
}

function parsePositions(input) {
    let moons = []
    let pattern = /<x=(.*), y=(.*), z=(.*)>/g
    input.split("\n").forEach(line => {
        // USe regex...
        let coordStr = line.replace(pattern, "$1 $2 $3")
        let coords = coordStr.split(" ")
        if (coords.length != 3) {
            throw `Bad input line ${line}`
        }
        let x = parseInt(coords[0])
        let y = parseInt(coords[1])
        let z = parseInt(coords[2])
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            throw `Bad input line ${line}`
        }
        moons.push(new Moon(x, y, z))
    })
    return moons
}

function getTotalEnergy(moons) {
    let energy = 0;
    moons.forEach(m => {
        energy += m.getEnergy()
    });
    return energy
}

// Stringify the fgiven axis of all the moons
function stateToString(moons, axis) {
    return moons.map(m => m[axis].pos + "," + m[axis].vel).join(":")
}

function run_day12() {
    read_text_input("inputs/day12.txt", (input) => {
        let moons = parsePositions(input)
        const TIMESTEPS = 1000
        for (let i = 0; i < TIMESTEPS; i++) {
            runSingleTimeStep(moons)
        }
        let part1energy = getTotalEnergy(moons)

        // Part2.  Reset moon state.
        moons = parsePositions(input)
        let step = 0;
        // Cycle - start point and length
        let xstep = 0
        let ystep = 0
        let zstep = 0
        let startx = stateToString(moons, "x");
        let starty = stateToString(moons, "y");
        let startz = stateToString(moons, "z");
        let currentx = ""
        let currenty = ""
        let currentz = ""

        while ((xstep == 0) || (ystep == 0) || (zstep == 0)) {
            runSingleTimeStep(moons)
            step++

            if (xstep == 0) {
                // Check for a cycle in the x-velocity
                currentx = stateToString(moons, "x");
                if (currentx == startx) {
                    console.log(`X-state match: step ${step}`)
                    xstep = step
                }
            }
            if (ystep == 0) {
                // Check for a cycle in the x-velocity
                currenty = stateToString(moons, "y");
                if (currenty == starty) {
                    console.log(`Y-state match: step ${step}`)
                    ystep = step
                }
            }

            if (zstep == 0) {
                // Check for a cycle in the z-velocity
                currentz = stateToString(moons, "z");
                if (currentz == startz) {
                    console.log(`Z-state match: step ${step}`)
                    zstep = step
                }
            }

        }

        let cycle = getLcm(xstep, ystep, zstep)

        document.getElementById("day12").innerHTML = `Total energy after ${TIMESTEPS} simulations: ${part1energy}.  Repeating cycle: ${cycle}`;
    })
}

function tests_day12() {
    let passes = 0;

    let moons = [
        new Moon(-1, 0, 2),
        new Moon(2, -10, -7),
        new Moon(4, -8, 8),
        new Moon(3, 5, -1),
    ]
    runSingleTimeStep(moons)
    console.log(`Verifying first time step...`)
    assert(moons[0].x.pos, 2)
    assert(moons[0].x.vel, 3)
    assert(moons[0].y.pos, -1)
    assert(moons[0].y.vel, -1)
    assert(moons[0].z.pos, 1)
    assert(moons[0].z.vel, -1)

    assert(moons[1].x.pos, 3)
    assert(moons[1].x.vel, 1)
    assert(moons[1].y.pos, -7)
    assert(moons[1].y.vel, 3)
    assert(moons[1].z.pos, -4)
    assert(moons[1].z.vel, 3)

    assert(moons[2].x.pos, 1)
    assert(moons[2].x.vel, -3)
    assert(moons[2].y.pos, -7)
    assert(moons[2].y.vel, 1)
    assert(moons[2].z.pos, 5)
    assert(moons[2].z.vel, -3)

    assert(moons[3].x.pos, 2)
    assert(moons[3].x.vel, -1)
    assert(moons[3].y.pos, 2)
    assert(moons[3].y.vel, -3)
    assert(moons[3].z.pos, 0)
    assert(moons[3].z.vel, 1)


    passes += test_assert("1.1", getLcm(4, 6, 14), 84)
    passes += test_assert("1.2", getLcm(15, 7, 10), 210)

    document.getElementById("tests12").innerHTML = `${passes}/2 tests passed!`;

}

export { run_day12, tests_day12 };