// Replace 13 with the day number, then rename and save.
// Solutions for AoC day 13
import { read_text_input, test_assert } from "./utils.js";
import { IntCode, arrayInputGenerator } from "./intcode.js";

var arcadeWindow = null;
var score = 0;
var xball = 0;
var xpaddle = 0;
var lastoutput = 0;
var numBlocks = 0;
var arcade = null;

function run_day13() {
    read_text_input("inputs/day13.txt", (input) => {
        let game = input.split(",")
        // Comment this out to get static setup
        game[0] = 2
        async function* joystick() {
            while (!arcade.halted) {
                processOutput()
                // Sleep before each input to avoid CPU load
                function sleep(duration) {
                    return new Promise(resolve => setTimeout(resolve, duration))
                }
                await sleep(0.2)
                // Emulate sending inputs,
                // based on whther the ball is left or right of the paddle.
                if (xball < xpaddle) {
                    yield -1
                } else if (xball > xpaddle) {
                    yield 1
                } else {
                    yield 0
                }
            }
        }

        function processOutput() {
            let grid = arcadeWindow.document.getElementById("gamegrid")
            for (lastoutput; lastoutput < arcade.outputs.length; lastoutput += 3) {
                const x = arcade.outputs[lastoutput]
                const y = arcade.outputs[lastoutput + 1]
                const tileId = arcade.outputs[lastoutput + 2]

                if ((x == -1) && (y == 0)) {
                    //Score update
                    score = tileId
                    arcadeWindow.document.getElementById("scoreval").innerHTML = `${score}`
                    continue
                }
                let tileClass;
                switch (tileId) {
                    case 0:
                        tileClass = "empty"
                        break;
                    case 1:
                        tileClass = "wall"
                        break;
                    case 2:
                        tileClass = "block"
                        numBlocks++
                        break;
                    case 3:
                        tileClass = "paddle"
                        xpaddle = x;
                        break;
                    case 4:
                        tileClass = "ball"
                        xball = x;
                        break;

                    default:
                        throw "Invalid tile type"
                        break;
                }

                console.debug(`Tile ${tileClass} at (${x}, ${y})`)
                let cellId = `${x},${y}`
                let elem = arcadeWindow.document.getElementById(cellId)
                if (elem == null) {
                    elem = arcadeWindow.document.createElement("div")
                    grid.appendChild(elem)
                }
                elem.setAttribute("class", `cell ${tileClass}`)
                elem.setAttribute("id", cellId)
                elem.style.setProperty("grid-row", `${y + 1}`)
                elem.style.setProperty("grid-column", `${x + 1}`)
                elem.innerHTML = "<pre> </pre>"
            }

        }

        let runGame = () => {
            arcade = new IntCode(game, joystick())
            arcade.run().then(() => {
                // Re-generate outputs in case score has changed!
                processOutput()
                document.getElementById("day13").innerHTML = `Number of Blocks: ${numBlocks}.  Final score: ${score}.`;
            })
        }

        if (arcadeWindow == null || arcadeWindow.closed) {
            arcadeWindow = window.open("arcade.html",
                "Arcade",
                `location=no,status=no,resizable=no,scrollbars=no,toolbar=no,menubar=no`);
            arcadeWindow.onload = runGame
        } else {
            runGame()
        }
    })
}

function tests_day13() {
    let passes = 0;
    document.getElementById("tests13").innerHTML = `${passes}/0 tests passed!`;
}

export { run_day13, tests_day13 };