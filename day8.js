import { read_text_input, renderImage, test_assert } from "./utils.js";

const IMAGE_HEIGHT = 6;
const IMAGE_WIDTH = 25;
const LAYER_SIZE = IMAGE_HEIGHT * IMAGE_WIDTH;


function countDigitInArray(input, digit) {
    return input.reduce((total, value) => { if (value == digit) { return total + 1 } else { return total } }, 0)
}

// split the image into layers
function get_layer_with_fewest_zeros(input) {
    let idx = 0;
    let bestSoFar = {size: LAYER_SIZE, layer: null };
    for (idx = 0; idx < input.length; idx += LAYER_SIZE) {
        let nextLayer = input.slice(idx, idx + LAYER_SIZE);
        let zeroCount = countDigitInArray(nextLayer, "0")
        console.debug("layer index, num zeroes", idx, zeroCount)
        if (zeroCount < bestSoFar.size) {
            bestSoFar = {size: zeroCount, layer: nextLayer }
            console.debug("New best: layer idx, zeroes", idx, zeroCount)
        }

    }
    return bestSoFar
}

function getFinalPixelColours(input) {
    // initialize the image as transpaent.
    let image = Array.from('2'.repeat(LAYER_SIZE))
    // Iterate over the layers
    for (let idx = 0; idx < input.length; idx += LAYER_SIZE) {
        let nextLayer = input.slice(idx, idx + LAYER_SIZE);
        // If we haven't yet found the colour for this pixel, set it.
        // The first non-transaprent (ie not 2) value is what we want
        nextLayer.forEach((colour, pxl) => {
            if (image[pxl] == "2") {
                image[pxl] = colour
            }
        })
    }

    // Check the image has not transparent fields!
    image.forEach((colour) => {if (colour == "2") {throw "Transaprertn pixel in image!"} })
    return image
}

function run_day8() {
    read_text_input("inputs/day8.txt", (input) => {
        let inputArray = input.split("")
        let layer = get_layer_with_fewest_zeros(inputArray).layer
        console.log("Layer is:", layer)
        let answer = countDigitInArray(layer, "1") * countDigitInArray(layer, "2")
        let image = renderImage(getFinalPixelColours(inputArray))
        document.getElementById("day8").innerHTML = `Answer for part1: ${answer}, image: ${image}`;
    })
}

function tests_day8() {
    let passes = 0;
    document.getElementById("tests8").innerHTML = `${passes}/0 tests passed!`;

}

export { run_day8, tests_day8 };