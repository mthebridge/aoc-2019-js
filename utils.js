
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
        console.log("TEST FAILED:" + a + "!=" + b)
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

export { read_text_input, test_assert, assert };