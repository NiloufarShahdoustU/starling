import { InitialRewardAmount, NumberOfTrials, eachClassTrialNumber } from './global_variables.js';
import { runTask } from './task.js';
import { runTaskMissed } from './task_missed.js';
import { taskDescription } from './task_description.js';
import { taskQuestionnaire } from './task_questionnaire.js';

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
    console.log("Experiment finished.");
    // Download will be handled before questionnaire, so no need for extra download here
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

function downloadAllTaskData() {
  const csvData = convertAllTaskDataToCSV(allTaskData);  // Convert merged data to CSV

  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero
  var day = ("0" + date.getDate()).slice(-2); // Add leading zero
  var hours = ("0" + date.getHours()).slice(-2); // Add leading zero
  var minutes = ("0" + date.getMinutes()).slice(-2); // Add leading zero
  var seconds = ("0" + date.getSeconds()).slice(-2); // Add leading zero
  var dateTime = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;

  
    
  // Define the filename with a timestamp or fixed name
  var fileName = "task_data_" + dateTime + ".csv";  // Adds timestamp to make it unique

  // Create a Blob and save the file
  var blob = new Blob([csvData], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;  // Downloads file with auto-generated name
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
}

// Function to handle missed trials asynchronously and merge taskData locally
async function handleMissedTrials(MissedTrials, rewardInput) {
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
    const result = await runTaskMissed(jsPsych, MissedTrials, rewardInput);

    MissedTrials = result[0];
    rewardInput = result[1];
    let taskData = result[2];

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
  }

  return { rewardInput, taskData: mergedTaskData };
}

async function runAllTasks() {
  var timeline = [];

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
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward);
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward);
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

  } else { // If order number is 2, the flow is: uni, high, low, then mixture of all these
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_uni, WholeReward);
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward);
    mergeTaskDataIntoAll(taskData, allTaskData);
    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward);
    mergeTaskDataIntoAll(taskData, allTaskData);
    result = await handleMissedTrials(MissedTrials, WholeReward);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);
  }

  // Mixed rounds
  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(0 * eachClassTrialNumber, 1 * eachClassTrialNumber), WholeReward);
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(1 * eachClassTrialNumber, 2 * eachClassTrialNumber), WholeReward);
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(2 * eachClassTrialNumber, 3 * eachClassTrialNumber), WholeReward);
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  // Download data before questionnaire
  downloadAllTaskData();

  // Now run the questionnaire
  await taskQuestionnaire(jsPsych);

  // Run the timeline
  jsPsych.run(timeline);
}

// Start the experiment
runAllTasks();
