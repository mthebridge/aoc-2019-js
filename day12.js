// Replace 12 with the day number, then rename and save.
// Solutions for AoC day 12
import { read_text_input, assert } from "./utils.js";

class Moon {
    constructor(x, y, z) {
        console.log(`New moon at (${x}, ${y}, ${z})`)
        this.xpos = x
        this.ypos = y
        this.zpos = z
        this.xvel = 0
        this.yvel = 0
        this.zvel = 0
    }

    // Update velocity based on another moon
    simulateGravity(other) {
        if (this.xpos < other.xpos) {
            this.xvel += 1;
            other.xvel -= 1;
        }
        if (this.xpos > other.xpos) {
            this.xvel -= 1;
            other.xvel += 1;
        }

        if (this.ypos < other.ypos) {
            this.yvel += 1;
            other.yvel -= 1;
        }
        if (this.ypos > other.ypos) {
            this.yvel -= 1;
            other.yvel += 1;
        }

        if (this.zpos < other.zpos) {
            this.zvel += 1;
            other.zvel -= 1;
        }
        if (this.zpos > other.zpos) {
            this.zvel -= 1;
            other.zvel += 1;
        }
    }

    // update position based on velocity
    simulateVelocity() {
        this.xpos += this.xvel
        this.ypos += this.yvel
        this.zpos += this.zvel
    }


    getEnergy() {
        // Total all absolute positions and velocities
        let potential = Math.abs(this.xpos) + Math.abs(this.ypos) + Math.abs(this.zpos)
        let kinetic =  Math.abs(this.xvel) + Math.abs(this.yvel) + Math.abs(this.zvel)
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
    assert(moons[0].xpos, 2)
    assert(moons[0].xvel, 3)
    assert(moons[0].ypos, -1)
    assert(moons[0].yvel, -1)
    assert(moons[0].zpos, 1)
    assert(moons[0].zvel, -1)

    assert(moons[1].xpos, 3)
    assert(moons[1].xvel, 1)
    assert(moons[1].ypos, -7)
    assert(moons[1].yvel, 3)
    assert(moons[1].zpos, -4)
    assert(moons[1].zvel, 3)

    assert(moons[2].xpos, 1)
    assert(moons[2].xvel, -3)
    assert(moons[2].ypos, -7)
    assert(moons[2].yvel, 1)
    assert(moons[2].zpos, 5)
    assert(moons[2].zvel, -3)

    assert(moons[3].xpos, 2)
    assert(moons[3].xvel, -1)
    assert(moons[3].ypos, 2)
    assert(moons[3].yvel, -3)
    assert(moons[3].zpos, 0)
    assert(moons[3].zvel, 1)

    document.getElementById("tests12").innerHTML = `${passes}/0 tests passed!`;

}

export { run_day12, tests_day12 };