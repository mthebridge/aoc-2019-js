// Solutions for AoC day 11
import { read_text_input, renderImage } from "./utils.js";
import { IntCode } from "./intcode.js";




class Robot {
    constructor(program) {
        this.x = 0;
        this.y = 0;
        // track where the edges of the image are.
        this.left = 0
        this.right = 0
        this.top = 0
        this.bottom = 0
        // Use UDLR for the current direction.
        this.facing = "U"

        // We need to keep track of the panel colors, and where the robot has been.
        // index the panel on 10000 * x-coord + y-coord
        this.panel = new Map()
        // Comment this out for part1 answer...
        this.panel.set(this.getCurrentPanelIndex(), 1)

        // How many paints we have processed
        this.paintCount = 0

        this.brain = new IntCode(program, this.getInput(), "HullRobot")
    }

    getCurrentPanelIndex() {
        return (this.x * 100000 + this.y)
    }

    getPanelColor(panelIdx) {
        let color = 0;
        if (this.panel.has(panelIdx)) {
            color = this.panel.get(panelIdx)
        }
        return color
    }


    async *getInput() {

        while (!this.brain.halted) {
            // Handle any outputs. Each paint generates 2 outputs.
            let idx = this.paintCount * 2;
            while (idx < this.brain.outputs.length) {
                // Another output
                let nextColor = this.brain.outputs[idx];
                let turnDir = this.brain.outputs[idx + 1];
                console.debug(`Processing outputs: ${nextColor}, ${turnDir}`)

                // Paint the panel.
                this.panel.set(this.getCurrentPanelIndex(), nextColor)
                console.debug(`Painting (${this.x}, ${this.y}) as ${nextColor}`)
                this.paintCount += 1

                // Check the direction and update turn
                if (turnDir == 0) {
                    // turn left.
                    switch (this.facing) {
                        case 'U':
                            this.facing = 'L'
                            this.x -= 1;
                            if (this.x < this.left) {
                                this.left = this.x
                            }
                            break;
                        case 'L':
                            this.facing = 'D'
                            this.y -= 1;
                            if (this.y < this.bottom) {
                                this.bottom = this.y
                            }
                            break;
                        case 'D':
                            this.facing = 'R'
                            this.x += 1;
                            if (this.x > this.right) {
                                this.right = this.x
                            }
                            break;
                        case 'R':
                            this.facing = 'U'
                            this.y += 1;
                            if (this.y > this.top) {
                                this.top = this.y
                            }
                            break;
                        default:
                            throw(`Invalid face direction ${this.facing}`)
                            break;
                    }
                } else {
                    // turn right.
                    switch (this.facing) {
                        case 'D':
                            this.facing = 'L'
                            this.x -= 1;
                            if (this.x < this.left) {
                                this.left = this.x
                            }
                            break;
                        case 'R':
                            this.facing = 'D'
                            this.y -= 1;
                            if (this.y < this.bottom) {
                                this.bottom = this.y
                            }
                            break;
                        case 'U':
                            this.facing = 'R'
                            this.x += 1;
                            if (this.x > this.right) {
                                this.right = this.x
                            }
                            break;
                        case 'L':
                            this.facing = 'U'
                            this.y += 1;
                            if (this.y > this.top) {
                                this.top = this.y
                            }
                            break;
                        default:
                            throw(`Invalid face direction ${this.facing}`)
                            break;
                    }
                }
                idx += 2;
            }

            // Now yield the current value, defaulting to black
            let color = this.getPanelColor(this.getCurrentPanelIndex())
            console.debug(`Input from (${this.x}, ${this.y}): is ${color}`)
            yield color
        }
    }
}

function run_day11() {
    read_text_input("inputs/day11.txt", (input) => {
        let program = input.split(",");
        let robot = new Robot(program)
        robot.brain.run().then(res => {
            // Convert the panel into an image array.
            let image = []
            for (let y = robot.top; y >= robot.bottom; y--) {
              for (let x = robot.left; x <= robot.right; x++) {
                  image.push(robot.getPanelColor(x * 100000 + y).toString())
              }
            }

            document.getElementById("day11").innerHTML = `Robot painted ${robot.panel.size}:panels` + renderImage(image, robot.right + 1 - robot.left );
        })
    })
}

function tests_day11() {
    let passes = 0;
    document.getElementById("tests11").innerHTML = `${passes}/0 tests passed!`;

}

export { run_day11, tests_day11 };