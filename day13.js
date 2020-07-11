// Replace 13 with the day number, then rename and save.
// Solutions for AoC day 13
import { read_text_input, test_assert } from "./utils.js";
import { IntCode, arrayInputGenerator } from "./intcode.js";

var arcadeWindow = null;
var gameOutput = ""
function renderOutput() {
    console.log("Rendering output...")
    arcadeWindow.document.getElementById("display").innerHTML = gameOutput
}

function run_day13() {
    read_text_input("inputs/day13.txt", (input) => {
        let arcade = new IntCode(input.split(","), arrayInputGenerator([]))
        arcade.run().then(_ => {
            let numBlocks = 0;
            let width = 0;
            let height = 0;

            let output = `<div class="grid">`

            for (let i = 0; i < arcade.outputs.length; i += 3) {
                const x = arcade.outputs[i]
                width = Math.max(width, x + 1)
                const y = arcade.outputs[i + 1]
                height = Math.max(height, y + 1)
                const tileId = arcade.outputs[i + 2]
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
                        break;
                    case 4:
                        tileClass = "ball"
                        break;

                    default:
                        throw "Invalid tile type"
                        break;
                }

                // console.debug(`Tile ${tileClass} at (${x}, ${y})`)
                output += `<div class="cell ${tileClass}" style="grid-row:${y + 1};grid-column:${x + 1}"><pre> </pre></div>`
            }
            output += `</div>`
            // Now render the grid!
            gameOutput = output
            // console.log(gameOutput)
            if (arcadeWindow == null || arcadeWindow.closed) {
                arcadeWindow = window.open("arcade.html",
                    "Arcade",
                    `location=no,status=no,resizable=no,scrollbars=no,toolbar=no,menubar=no`);
                    arcadeWindow.onload = renderOutput
            } else {
                renderOutput()
            }

            document.getElementById("day13").innerHTML = `Grid has ${numBlocks} blocks`;
        })
    })
}

function tests_day13() {
    let passes = 0;
    document.getElementById("tests13").innerHTML = `${passes}/0 tests passed!`;

}

export { run_day13, tests_day13 };