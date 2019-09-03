/* Rewriting the code snippets from the chapter here, with my own comments and explanations. */

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
