import { InitialRewardAmount, NumberOfTrials, eachClassTrialNumber } from './global_variables.js';
import { runTask } from './task.js';
import { runTaskMissed } from './task_missed.js';
import { taskDescription } from './task_description.js';

// Dataset name trial
var datasetNameTrial = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "Please enter the name of the dataset:" }
  ],
  on_finish: function(data){
    var datasetName = data.response.Q0; // Save the dataset name
    jsPsych.data.addProperties({ datasetName: datasetName });
  }
};

// Initialize jsPsych
const jsPsych = initJsPsych({
  on_finish: function() {
    var csvData = jsPsych.data.get().csv();
    var datasetName = jsPsych.data.get().last(1).values()[0].datasetName;

    // Define the filename with your desired path
    var fileName = "data/" + datasetName + ".csv"; // Suggesting "data" directory

    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;  // This is the suggested filename
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }
});

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
  var timeline = [];

  // Add the dataset name prompt at the beginning of the timeline
  timeline.push(datasetNameTrial);

  console.log("Starting description");
  const orderNumber = await taskDescription();
  console.log("Description finished");

  console.log("Starting first round...");
  let MissedTrials = { TrialNumber: [], Number1: [], Number2: [] };  // Ensure MissedTrials is initialized
  let WholeReward = InitialRewardAmount;

  // Predefined trial numbers for different rounds
  const trialNumber_fixed_uni = [...Array(eachClassTrialNumber).keys()];
  const trialNumber_fixed_low_first = [...Array(eachClassTrialNumber).keys()].map(i => i + eachClassTrialNumber);
  const trialNumber_fixed_high_first = [...Array(eachClassTrialNumber).keys()].map(i => i + 2 * eachClassTrialNumber);

  const trialNumber_mixed = jsPsych.randomization.shuffle([...Array(NumberOfTrials).keys()]);

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

  // Run the timeline
  jsPsych.run(timeline);
}

// Start the experiment
runAllTasks();
