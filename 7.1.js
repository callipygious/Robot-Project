/*  Measuring a robot

It’s hard to objectively compare robots by just letting them solve a few scenarios. Maybe one robot just happened to get easier tasks or the kind of tasks that it is good at, whereas the other didn’t.

Write a function compareRobots that takes two robots (and their starting memory). It should generate 100 tasks and let each of the robots solve each of these tasks. When done, it should output the average number of steps each robot took per task.

For the sake of fairness, make sure you give each task to both robots, rather than generating different tasks per robot.  */

function compareRobots(robot1, memory1, robot2, memory2) {

  function recordBot(state, robot, memory) {
    for (let turn = 0;; turn++) {
      if (state.parcels.length == 0) {
      //console.log(`Done in ${turn} turns`);
      //break;
        return turn
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
      //console.log(`Moved to ${action.direction}`);
    }
  }

  let bot1 = [];
  let bot2 = [];

  for (i = 0; i <= 100; i++)  {
    let villa = VillageState.random()
    bot1.push(recordBot(villa, robot1, memory1))
    bot2.push(recordBot(villa, robot2, memory2))
  }

  let average = function(arr) {
    let result = 0;
    for (let val of arr) {
      result += val;
    }
    return (result/arr.length)
  }

  let avg1 = average(bot1);
  let avg2 = average(bot2);

  console.log(`Robot 1 averaged ${Math.round(avg1)} turns to completion,
  while Robot 2 averaged ${Math.round(avg2)} turns.`)
}

compareRobots(routeRobot, [], goalOrientedRobot, []);


//Book Answer:
function countSteps(state, robot, memory) {
  for (let steps = 0;; steps++) {
    if (state.parcels.length == 0) return steps;
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

function compareRobots(robot1, memory1, robot2, memory2) {
  let total1 = 0, total2 = 0;
  for (let i = 0; i < 100; i++) {
    let state = VillageState.random();
    total1 += countSteps(state, robot1, memory1);
    total2 += countSteps(state, robot2, memory2);
  }
  console.log(`Robot 1 needed ${total1 / 100} steps per task`)
  console.log(`Robot 2 needed ${total2 / 100}`)
}
