import { read_text_input, test_assert } from "./utils.js";

class Planetoid {
    constructor(name) {
        this.name = name;
        this.orbiting = null;
        this.orbitBy = [];
        this.totalOrbits = 0;
    } 

    // Add new indirect orbits to this planet and all orbiters.  Recurses.
    addIndirectOrbits(numInner) {
        // console.debug("Adding orbits:", this.name, numInner)
        this.totalOrbits += numInner;
        this.orbitBy.forEach(p => p.addIndirectOrbits(numInner))
    }

    // Generate an iterator to walk all reachable planets
    * neighboursGenerator() {
        if (this.orbiting) {
            yield this.orbiting
        }

        yield * this.orbitBy
    }
}


function findOrCreatePlanet(orbitTree, name) {
    let planet = orbitTree.find((val, index, tree) => val.name == name)
    if (!planet) {
        // console.debug("Adding new planet", name)
        planet = new Planetoid(name);
        orbitTree.push(planet)
    }
    return planet
}

// Find the shortest path between two planets
function findShortestDistance(start, end) {
    function* findRoutes(planet, target, route) {
        // console.debug("Adding planet to route", planet.name, route)
        route.push(planet)
        for (const neighbour of planet.neighboursGenerator()) {
            // console.debug("Next neighbour", neighbour.name)
            if (neighbour == target) {
                // Match!
                console.log("Valid route", route)
                yield route
            } else {
                // Don't loop back!
                if (!route.find(p => p.name == neighbour.name)) {
                    yield *findRoutes(neighbour, target, route)
                }
            }
        }
        route.pop()
    }

    if (start == end) {
        return 0
    }

    // Check all the routes.
    let min_so_far = 0xFFFFFFFF
    for (const r of findRoutes(start, end, [])) {
        console.debug("findroutes return", r)
        if (r.length < min_so_far) {
            min_so_far =  r.length
        }
    }

    return min_so_far
}

// Take an array of orbit input lines.
function buildOrbitData(inputs) {
    let orbitTree = [new Planetoid("COM")]
    let orbitData = inputs.split('\n')
    orbitData.forEach(orbit => {
        // Each orbit is pf the form "NAME)NAME"
        let bodies = orbit.split(")")
        if (bodies.length != 2) {
            console.warn(`Invalid input line: ${orbit}`)
            return
        }
        let inner = findOrCreatePlanet(orbitTree, bodies[0].trim())
        let outer = findOrCreatePlanet(orbitTree, bodies[1].trim())
        if (outer.orbiting) {
            throw `Planet ${outer.name} already has an orbit!`
        }
        outer.orbiting = inner
        inner.orbitBy.push(outer) 
        // console.debug(`${outer.name} orbits ${inner.name}`)
        
        // Update orbit counts.  Anything inner to this planet is unchanged, but all
        // orbits further out need accounting for. 
        // Add the number of inner orbits, plus 1 for this orbit.
        outer.addIndirectOrbits(inner.totalOrbits + 1)
    });

    return orbitTree
}

function countOrbits(tree) {
    return tree.reduce((total, value) => {return (total + value.totalOrbits)}, 0)
}

function run_day6() {
    read_text_input("inputs/day6.txt", (input) => {
        let orbits = buildOrbitData(input)
        let total = countOrbits(orbits)   
        let me = orbits.find(p => p.name == "YOU").orbiting
        let santa = orbits.find(p => p.name == "SAN").orbiting
        let dist = findShortestDistance(me, santa)  
        document.getElementById("day6").innerHTML = `Total orbits: ${total}, distance to Santa: ${dist}`;
    })
}

function tests_day6() {
    let passes = 0;
    let map = `COM)B
    B)C
    C)D
    D)E
    E)F
    B)G
    G)H
    D)I
    E)J
    J)K
    K)L`;
    let orbits = buildOrbitData(map)
    console.info(orbits)
    passes += test_assert("1.1", countOrbits(orbits), 42) 
    let map2 = `COM)B
    B)C
    C)D
    D)E
    E)F
    B)G
    G)H
    D)I
    E)J
    J)K
    K)L
    K)YOU
    I)SAN`
    let orbits2 = buildOrbitData(map2)
    console.info(orbits2)
    let me = orbits2.find(p => p.name == "YOU").orbiting
    let santa = orbits2.find(p => p.name == "SAN").orbiting
    passes += test_assert("2.1", findShortestDistance(me, santa), 4) 
    document.getElementById("tests6").innerHTML = `${passes}/2 tests passed!`;

}

export { run_day6, tests_day6 };