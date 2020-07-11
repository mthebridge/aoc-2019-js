
function read_text_input(file, callback) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status < 400) {
            // console.debug("Read text input OK");
            callback(xhttp.responseText)
        }
    }
    xhttp.open("GET", file, true);
    xhttp.send()
}

function assert(a, b) {
    if (a != b) {
        console.log("ASSERT FAILED:" + a + "!=" + b)
        return false
    } else {
        console.log("Test passed!")
        return true
    }
}

function test_assert(desc, a, b) {
    console.log("Running test: " + desc)
    return assert(a, b)
}

function renderImage(imageData, imageWidth)  {
    // Create a simple div!
    let outHtml = "<pre>\n"
    imageData.forEach((colour, index) => {
        let colourString;
        if (colour == "0") {
            colourString = "white"
        }
        if (colour == "1") {
            colourString = "black"
        }
        outHtml += `<span style="background-color:${colourString}"> </span>`
        if ((index % imageWidth) == imageWidth - 1) {
            outHtml += "\n"
        }
    })
    outHtml += "\n</pre>"
    return outHtml
}

export { read_text_input, test_assert, assert, renderImage };