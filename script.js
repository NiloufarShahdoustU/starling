import { InitialRewardAmount, NumberOfTrials, ClassNumber, eachClassTrialNumber } from './global_variables.js';
import { runTask } from './task.js';
import { runTaskMissed } from './task_missed.js';
import { taskDescription } from './task_description.js';

// Initialize jsPsych
const jsPsych = initJsPsych();

// Fixed trials with uni first, high next, low last
const trialNumber_fixed_uni = [];
for (let temp_var = 0 * eachClassTrialNumber; temp_var < 1 * eachClassTrialNumber; temp_var++) {
  trialNumber_fixed_uni.push(temp_var);
}

const trialNumber_fixed_low_first = [];
for (let temp_var = 1 * eachClassTrialNumber; temp_var < 2 * eachClassTrialNumber; temp_var++) {
  trialNumber_fixed_low_first.push(temp_var); 
}

const trialNumber_fixed_high_first = [];
for (let temp_var = 2 * eachClassTrialNumber; temp_var < 3 * eachClassTrialNumber; temp_var++) {
  trialNumber_fixed_high_first.push(temp_var);
}

// Mixed trials for the second round
let trialNumber_mixed = [];
for (let i = 0; i < NumberOfTrials; i++) {
  trialNumber_mixed.push(i);
}
trialNumber_mixed = jsPsych.randomization.shuffle(trialNumber_mixed);

// Function to handle missed trials asynchronously
async function handleMissedTrials(MissedTrials, rewardInput) {
  while (MissedTrials.TrialNumber.length > 0) {
    console.log("Now handling missed trials...");
    [MissedTrials, rewardInput] = await runTaskMissed(jsPsych, MissedTrials, rewardInput);
    console.log("Missed trials completed.");
  }
  return rewardInput; // Return the updated reward
}


// Function to run all tasks in sequence
async function runAllTasks() {
  console.log("Starting description");
  const orderNumber = await taskDescription();
  console.log("Description finished");

  console.log("Starting first round...");
  let MissedTrials = { TrialNumber: [], Number1: [], Number2: [] };  // Ensure MissedTrials is initialized
  let WholeReward = InitialRewardAmount;

  if (orderNumber == 1) {
    [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_fixed_uni, WholeReward);
    console.log("First round completed.");
    WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

    console.log("Starting second round...");
    [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward);
    console.log("Second round completed.");
    WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

    console.log("Starting third round...");
    [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward);
    console.log("Third round completed.");
    WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

  } else { // If order number is 2, the flow is: uni, high, low, then mixture of all these
    [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_fixed_uni, WholeReward);
    console.log("First round completed.");
    WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

    console.log("Starting second round...");
    [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward);
    console.log("Second round completed.");
    WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

    console.log("Starting third round...");
    [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward);
    console.log("Third round completed.");
    WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward
  }

  // Mixed rounds
  console.log("Starting mixed round 1...");
  [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_mixed.slice(0 * eachClassTrialNumber, 1 * eachClassTrialNumber), WholeReward);
  console.log("Mixed round 1 completed.");
  WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

  console.log("Starting mixed round 2...");
  [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_mixed.slice(1 * eachClassTrialNumber, 2 * eachClassTrialNumber), WholeReward);
  console.log("Mixed round 2 completed.");
  WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

  console.log("Starting mixed round 3...");
  [MissedTrials, WholeReward] = await runTask(jsPsych, trialNumber_mixed.slice(2 * eachClassTrialNumber, 3 * eachClassTrialNumber), WholeReward);
  console.log("Mixed round 3 completed.");
  WholeReward = await handleMissedTrials(MissedTrials, WholeReward);  // Update WholeReward

  console.log("All tasks completed.");
}

// Start the experiment
runAllTasks();
