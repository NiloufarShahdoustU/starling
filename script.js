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

let taskData = [];

let allTaskData = {
  arrowRT: [],
  distribution: [],
  interTrialInterval: [],
  outcome: [],
  myCard: [],
  yourCard: [],
  spaceRT: [],
  totalReward: [],
  trialIndex: [],
  trialType: [],
  choice: []
};



const jsPsych = initJsPsych({
  on_finish: function() {
    const csvData = convertAllTaskDataToCSV(allTaskData);  // Convert merged data to CSV
    
    // Get the dataset name from the last recorded trial
    var datasetName = jsPsych.data.get().last(1).values()[0].datasetName;

    // Define the filename with your desired path
    var fileName = "data/" + datasetName + ".csv"; // Suggesting "data" directory

    // Create a Blob and save the file
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





function mergeTaskDataIntoAll(taskData, allTaskData) {
  for (let key in taskData) {
    if (taskData.hasOwnProperty(key)) {
      allTaskData[key] = allTaskData[key].concat(taskData[key]);
    }
  }
}


function convertAllTaskDataToCSV(allTaskData) {
  const headers = Object.keys(allTaskData).join(",");
  const rows = [];
  const numRows = allTaskData.arrowRT.length;  // Assume all columns are the same length
  for (let i = 0; i < numRows; i++) {
    const row = Object.keys(allTaskData).map(key => allTaskData[key][i]).join(",");
    rows.push(row);
  }
  return headers + "\n" + rows.join("\n");
}



// Function to handle missed trials asynchronously and merge taskData locally
async function handleMissedTrials(MissedTrials, rewardInput) {
  // Initialize a structured object to accumulate data for all missed trials
  let mergedTaskData = {
    arrowRT: [],
    distribution: [],
    interTrialInterval: [],
    outcome: [],
    myCard: [],
    yourCard: [],
    spaceRT: [],
    totalReward: [],
    trialIndex: [],
    trialType: [],
    choice: []
  };

  while (MissedTrials.TrialNumber.length > 0) {
    // console.log("Now handling missed trials...");
    
    // Run the missed trials task
    const result = await runTaskMissed(jsPsych, MissedTrials, rewardInput);

    MissedTrials = result[0];
    rewardInput = result[1];
    let taskData = result[2]; // Get taskData from the missed trials
    
    // Assume taskData comes in an object structure like:
    // taskData = {arrowRT, distribution, interTrialInterval, outcome, myCard, yourCard, spaceRT, totalReward, trialNumber, trialType}

    // Merge each field into the corresponding array in mergedTaskData
    mergedTaskData.arrowRT = mergedTaskData.arrowRT.concat(taskData.arrowRT);
    mergedTaskData.distribution = mergedTaskData.distribution.concat(taskData.distribution);
    mergedTaskData.interTrialInterval = mergedTaskData.interTrialInterval.concat(taskData.interTrialInterval);
    mergedTaskData.outcome = mergedTaskData.outcome.concat(taskData.outcome);
    mergedTaskData.myCard = mergedTaskData.myCard.concat(taskData.myCard);
    mergedTaskData.yourCard = mergedTaskData.yourCard.concat(taskData.yourCard);
    mergedTaskData.spaceRT = mergedTaskData.spaceRT.concat(taskData.spaceRT);
    mergedTaskData.totalReward = mergedTaskData.totalReward.concat(taskData.totalReward);
    mergedTaskData.trialIndex = mergedTaskData.trialIndex.concat(taskData.trialIndex);
    mergedTaskData.trialType = mergedTaskData.trialType.concat(taskData.trialType);
    mergedTaskData.choice = mergedTaskData.choice.concat(taskData.choice);

    // console.log("Missed trials completed.");
  }
  
  return { rewardInput, taskData: mergedTaskData }; // Return the merged taskData as one object
}






// Function to run all tasks in sequence
async function runAllTasks() {
  var timeline = [];

  // Add the dataset name prompt at the beginning of the timeline
  timeline.push(datasetNameTrial);

  // console.log("Starting description");
  const orderNumber = await taskDescription();
  // console.log("Description finished");

  // console.log("Starting first round...");
  let MissedTrials = { TrialNumber: [], Number1: [], Number2: [] };  // Ensure MissedTrials is initialized
  let WholeReward = InitialRewardAmount;
  
  // Predefined trial numbers for different rounds
  const trialNumber_fixed_uni = [...Array(eachClassTrialNumber).keys()];
  const trialNumber_fixed_low_first = [...Array(eachClassTrialNumber).keys()].map(i => i + eachClassTrialNumber);
  const trialNumber_fixed_high_first = [...Array(eachClassTrialNumber).keys()].map(i => i + 2 * eachClassTrialNumber);

  const trialNumber_mixed = jsPsych.randomization.shuffle([...Array(NumberOfTrials).keys()]);
  let result;

  if (orderNumber == 1) {
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_uni, WholeReward);
    // console.log("First round completed.");
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);


    // console.log("Starting second round...");
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward);
    // console.log("Second round completed.");
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);


    // console.log("Starting third round...");
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward);
    // console.log("Third round completed.");
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

  } else { // If order number is 2, the flow is: uni, high, low, then mixture of all these
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_uni, WholeReward);
    // console.log("First round completed.");
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    // console.log("Starting second round...");
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward);
    // console.log("Second round completed.");
    mergeTaskDataIntoAll(taskData, allTaskData);
    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    // console.log("Starting third round...");
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward);
    // console.log("Third round completed.");
    mergeTaskDataIntoAll(taskData, allTaskData);
    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);
  }

  // Mixed rounds
  // console.log("Starting mixed round 1...");
  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(0 * eachClassTrialNumber, 1 * eachClassTrialNumber), WholeReward);
  // console.log("Mixed round 1 completed.");
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  // console.log("Starting mixed round 2...");
  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(1 * eachClassTrialNumber, 2 * eachClassTrialNumber), WholeReward);
  // console.log("Mixed round 2 completed.");
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  // console.log("Starting mixed round 3...");
  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(2 * eachClassTrialNumber, 3 * eachClassTrialNumber), WholeReward);
  // console.log("Mixed round 3 completed.");
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  // console.log("All tasks completed.");

  // Run the timeline
  jsPsych.run(timeline);
}

// Start the experiment
runAllTasks();
