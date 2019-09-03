/* Rewriting the code snippets from the chapter here, with my own comments and explanations. */

//copying this from website
const roads = [   // List of every road in town. Each element in this array is a road segment listing its start and end point.
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

function buildGraph(edges) {  //Function that takes the list (array) of roads leading between places in town, and converts it into a map object that stores anm array of connected nodes for each node.
  let graph = Object.create(null);  //create the graph object
  function addEdge(from, to) {  //Function to take two locations and connect the destination node to the origin in the map, creating the origin node if it does not already exist
    if (graph[from] == null) {
      graph [from] == [to]; //If the origin node doesnt exist, creeate one with the destination location
    } else {
      graph[from].push(to); //Add the destination  to the origin's node in the object
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {  //r function creates origin and destination by splitting each entry in the array around the central "-" character. For loop performs this on each entry in the edges array to get each possible destination and origin in the list.
    addEdge(from, to);  //Create edge from first entry's two points.
    addedge(to, from);  // Create corresponding edge from the other direction between the points
  }
  return graph; // After the loop runs through each entry in the array, creating an edge petween each possible point, the final map is created containing an array of connected nodes for each node in the map.
}
const roadGraph = buildGraph(roads);

class VillageState {  //Current state of village created based on minimal set of values needed to define it.
  constructor (place, parcels) {  //create a state with the given value of parcel locations and current position of robot.
    this.place = place;
    this.parcels = parcels;
  }

  move (destination) {  //method for moving robot to a new destination
    if (!roadGraph[this.place].includes(destination)) {
      return this;  //If the current location of the robot (place) doesn't have a road leading to the given destination, then the move is impossible and the function returns the same place without moving
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;  //The parcels that are not being carried by the robot yet stay where they are
        return {place: destination, address: p.address};  //The location (place) of the carried parcel is updated to the current move's destination, with the same goal (address) as before
      }).filter (p => p.place != p.address);  //The parcels whose new location (place) is the same as their goal (address) are removed from the list since they have now been successfully delivered.
      return new VillageState (destination, parcels); //New state is created reflecting the move.
    }
  }
}

function runRobot (state, robot, memory) { //Runs a given robot simulation on the given town state with the given move history in memory.
  for (let turn = 0;; turn++) { //Loop to count how many turns to complete all deliveries
    if (state.parcels.length ==0) {
      console.log (`Done in ${turn} turns!`); //WHen all deliveries done, display how long it toook to finish
      break;  //end the function if completed
    }
    let action = robot(state, memory);  //Robot sim function is performed on the given town state and memory values, results saved in 'action' variable
    state = state.move(action.direction); //State is updated to new value after last move performed
    memory = action.memory; //Memory of function is set to the new value after move is performed
    console.log(`Moved to ${action.direction}`);  //Print the move performed this turn
  }
}

function randomPick (array) { //Function for choosing a random entry in a given array
  let choice = Math.floor(Math.random() * array.length);  //'random' chooses a number between zero and one. Multiply by the total number of entries in the array (length), and 'floor' rounds down to the closest digit, giving a random number within the range of the array length
  return array[choice];
}

function randomRobot (state) {  //Dumbest possible robot, moves at random. Doesnt even take a memory value.
  return{direction: randomPick(roadGraph[state.place])};  //Robot picks a random accessible location to travel to, by checking its current location in the given state and checking the town graph's corresponding array of corrected nodes (randomly choosing an edge on the graph)
}

VillageState.random = function (parcelCount = 5) {  //Adding a method property to the village constructor that creates a new town state with five randomly placed parcels.
  let parcels = []; //List of parcels starts out empty
  for (let i = 0; i < parcelCount; i++) { //loop to create each parcel
    let address = randomPick(Object.keys(roadGraph))  //From the list of locations (nodes in the graph, represented as keys in the roadGraph object,) choose one at random and set it as the  destination address for the package.
    let place;  //Create a place variable
    do {
      place = randomPick(Object.keys(roadGraph)); //Pick a random location for the package's current location
    } while (place == address); //Do loop used so a location is picked at least once, if the current location is chosen as the same as its destination, it loops again to pick a diferent spot.
    parcels.push({place, address}); // Save parcel to the list of parcels
  }
  return new VillageState("Post Office", parcels);  //Create new state with the complete list of random parcel locations, with mail robot starting at post office
};

runRobot(VillageState.random(), randomRobot); //Run simulation with dumb robot. Takes way too many turns.

const mailRoute = [ //Mail route, specific path for a mail bot to take to reach every location in town.
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];
