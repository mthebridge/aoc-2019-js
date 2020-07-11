// Replace 12 with the day number, then rename and save.
// Solutions for AoC day 12
import { read_text_input, assert } from "./utils.js";

class State {
    constructor(pos, vel) {
        this.pos = pos
        this.vel = vel
    }
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

function checkMatchingState(current, states, axis) {
    for (let i = 0; i < states.length; i++) {
        const state = states[i];

        if ((state[0].pos == current[0][axis].pos) &&
            (state[0].vel == current[0][axis].vel) &&
            (state[1].pos == current[1][axis].pos) &&
            (state[1].vel == current[1][axis].vel) &&
            (state[2].pos == current[2][axis].pos) &&
            (state[2].vel == current[2][axis].vel) &&
            (state[3].pos == current[3][axis].pos) &&
            (state[3].vel == current[3][axis].vel)) {
                // Match!!
                console.log(`Found match for ${axis}`)
                return i
            }

    }
    return states.length
}

function run_day12() {
    read_text_input("inputs/day12.txt", (input) => {
        let moons = parsePositions(input)
        const TIMESTEPS = 1000
        for (let i = 0; i < TIMESTEPS; i++) {
            if ((i % 10) == 0) {
                console.debug(`Running loop ${i}`)
            }
            runSingleTimeStep(moons)
        }

        // Part2.  Reset moon state.
        moons = parsePositions(input)
        let step = 0;
        let xstates = []
        let ystates = []
        let zstates = []
        // Cycle - start point and length
        let xcycle = [0, 0]
        let ycycle = [0, 0]
        let zcycle = [0, 0]

        while (xcycle[1] == 0 && ycycle[1] == 0 && zcycle[1] == 0) {
            if ((step % 10000) == 0) {
                console.debug(`Running loop ${step}`)
            }
            // Store the current state
            if (xcycle[1] == 0) {
                xstates.push([{...moons[0].x}, {...moons[1].x}, {...moons[2].x}, {...moons[3].x}])
            }
            if (ycycle[1] == 0) {
                ystates.push([{...moons[0].y}, {...moons[1].y}, {...moons[2].y}, {...moons[3].y}])
            }
            if (zcycle[1] == 0) {
                zstates.push([{...moons[0].z}, {...moons[1].z}, {...moons[2].z}, {...moons[3].z}])
            }
            runSingleTimeStep(moons)
            if (xcycle[1] == 0) {
                // Check for a cycle in the x-velocity
                let match_idx = checkMatchingState(moons, xstates, "x")
                if (match_idx != xstates.length) {
                    console.log(`X-state match: step ${match_idx} and step ${step}`)
                    xcycle = [match_idx, step - match_idx]
                }
            }
            if (ycycle[1] == 0) {
                // Check for a cycle in the x-velocity
                let match_idx = checkMatchingState(moons, ystates, "y")
                if (match_idx != ystates.length) {
                    console.log(`Y-state match: step ${match_idx} and step ${step}`)
                    ycycle = [match_idx, step - match_idx]
                }
            }

            if (zcycle[1] == 0) {
                // Check for a cycle in the z-velocity
                let match_idx = checkMatchingState(moons, zstates, "z")
                if (match_idx != zstates.length) {
                    console.log(`Z-state match: step ${match_idx} and step ${step}`)
                    zcycle = [match_idx, step - match_idx]
                }
            }
            step++

        }

        document.getElementById("day12").innerHTML = `Total energy after ${TIMESTEPS} simulations: ${getTotalEnergy(moons)}`;
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

    document.getElementById("tests12").innerHTML = `${passes}/0 tests passed!`;

}

export { run_day12, tests_day12 };