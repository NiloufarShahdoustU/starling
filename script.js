import { InitialRewardAmount, NumberOfTrials, eachClassTrialNumber } from './global_variables.js';
import { runTask } from './task.js';
import { runTaskMissed } from './task_missed.js';
import { taskDescription } from './task_description.js';
import { taskQuestionnaire } from './task_questionnaire.js';
import { taskQuestionnaire2 } from './task_questionnaire2.js';

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
  choice: [],
  block: [],
  timeoutRepeat:[]

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
async function handleMissedTrials(MissedTrials, rewardInput, blockNumber) {
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
    choice: [],
    block: [],
    timeoutRepeat:[]
  };

  while (MissedTrials.TrialNumber.length > 0) {
    const result = await runTaskMissed(jsPsych, MissedTrials, rewardInput, blockNumber);

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
    mergedTaskData.block = mergedTaskData.block.concat(taskData.block);
    mergedTaskData.timeoutRepeat = mergedTaskData.timeoutRepeat.concat(taskData.timeoutRepeat);
  }

  return { rewardInput, taskData: mergedTaskData };
}


async function RestMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size: 30px;">You can have some rest! <br>press <b>C</b> to continue.</div>',
    choices: ['c'],
    trial_duration: null 
  }]);
}





async function UniMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <div style="text-align: center;">
        <img src="img/uniform/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
        <div style="font-size: 20px;">
          <p>This is <b>block (1/4)</b>. It will take around 5 minutes to complete.</p>
          <p>The black deck contains cards 1 to 9. All the cards have an equal chance of being drawn by your opponent. For example: if you draw a 2 it is likely that the agent's card is higher.</p>
          <br><br>Press <b>C</b> to continue.
        </div>
      </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
}






async function LowFirstMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div style="text-align: center;">
    <img src="img/low/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
   <div style="font-size: 20px;">
   <p>This is <b>block (2/4)</b>. It will take around 5 minutes to complete.</p>
    <p>The orange deck contains cards 1 to 9. The lower valued cards have more chance of being drawn by your opponent. For example: if you draw a 5 it is likely that the agents card is lower.</p>
    <br><br>press <b>C</b> to continue.
            </div>
      </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
}


async function LowSecondMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div style="text-align: center;">
    <img src="img/low/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
   <div style="font-size: 20px;">
   <p>This is <b>block (3/4)</b>. It will take around 5 minutes to complete.</p>
    <p>The orange deck contains cards 1 to 9. The lower valued cards have more chance of being drawn by your opponent. For example: if you draw a 5 it is likely that the agents card is lower.</p>
    <br><br>press <b>C</b> to continue.
            </div>
      </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
}


async function HighFirstMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div style="text-align: center;">
    <img src="img/high/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
    <div style="font-size: 20px;">
     <p>This is <b>block (2/4)</b>. It will take around 5 minutes to complete.</p>
    <p>The green deck contains cards 1 to 9. The higher valued cards have more chance of being drawn by your opponent. For example: if you draw a 5 it is likely that the agents card is higher.</p>
    <br><br>press <b>C</b> to continue.
            </div>
      </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
}


async function HighSecondMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div style="text-align: center;">
    <img src="img/high/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
    <div style="font-size: 20px;">
     <p>This is <b>block (3/4)</b>. It will take around 5 minutes to complete.</p>
    <p>The green deck contains cards 1 to 9. The higher valued cards have more chance of being drawn by your opponent. For example: if you draw a 5 it is likely that the agents card is higher.</p>
    <br><br>press <b>C</b> to continue.
            </div>
      </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
}


async function MixMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <div style="text-align: center;">
            <img src="img/uniform/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
            <img src="img/low/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
            <img src="img/high/back.jpg" class="large-image" style="width: 150px; margin-bottom: 20px;">
            <div style="font-size: 20px;">
                <p>This is <b>block (4/4)</b>. It will take around 15 minutes to complete. You will now see cards from the black, orange, and green decks. Cards from these decks will now appear randomly.</p>
                <p>Try to remember:</p>
                <p>For the black deck: <b>All the cards have an equal chance</b> of being selected.</p>
                <p>For the orange deck: The <b>lower valued cards have more chance</b> of being selected.</p>
                <p>For the green deck: The <b>higher valued cards have more chance of</b> being selected.</p>
                <br><br>Press <b>C</b> to continue.
            </div>
        </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
}





async function QuestionnairesMessage() {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div style="font-size: 25px; width: 100%; text-align: center; line-height: 1.6; margin-top: 20px;">
      Thank you very much for completing the first questionnaire.<br><br>
      Please press <b>C</b> to continue to the next questionnaire.
    </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
}


async function TaskQuestionnairesMessage(wins, rows) {
  await jsPsych.run([{
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div style="font-size: 25px; width: 100%; text-align: center; line-height: 1.6; margin-top: 20px;">
      Thank you very much for completing the task.<br><br>
      Well done! You got <b style="color: green;">${wins}</b> out of <b>${rows}</b> trials <b style="color: green;">correct</b>!<br><br>
      Please press <b>C</b> to continue to the first questionnaire.
    </div>
    `,
    choices: ['c'],
    trial_duration: null 
  }]);
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
    
    await UniMessage();

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_uni, WholeReward, 1);
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward,1);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    await RestMessage();
    await LowFirstMessage();
    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward,2);
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward,2);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    await RestMessage();
    await HighSecondMessage();

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward,3);
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward,3);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

  } else { // If order number is 2, the flow is: uni, high, low, then mixture of all these
    await UniMessage();

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_uni, WholeReward,1);
    mergeTaskDataIntoAll(taskData, allTaskData);

    result = await handleMissedTrials(MissedTrials, WholeReward,1);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);

    await RestMessage();
    await HighFirstMessage();

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_high_first, WholeReward,2);
    mergeTaskDataIntoAll(taskData, allTaskData);
    result = await handleMissedTrials(MissedTrials, WholeReward,2);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);



    await RestMessage();
    await LowSecondMessage();

    [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_fixed_low_first, WholeReward,3);
    mergeTaskDataIntoAll(taskData, allTaskData);
    result = await handleMissedTrials(MissedTrials, WholeReward,3);
    WholeReward = result.rewardInput;
    taskData = result.taskData;
    mergeTaskDataIntoAll(taskData, allTaskData);
  }

  // Mixed rounds
  await RestMessage();
  await MixMessage();

  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(0 * eachClassTrialNumber, 1 * eachClassTrialNumber), WholeReward,4);
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward,4);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(1 * eachClassTrialNumber, 2 * eachClassTrialNumber), WholeReward,4);
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward,4);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  [MissedTrials, WholeReward, taskData] = await runTask(jsPsych, trialNumber_mixed.slice(2 * eachClassTrialNumber, 3 * eachClassTrialNumber), WholeReward,4);
  mergeTaskDataIntoAll(taskData, allTaskData);
  result = await handleMissedTrials(MissedTrials, WholeReward,4);
  WholeReward = result.rewardInput;
  taskData = result.taskData;
  mergeTaskDataIntoAll(taskData, allTaskData);

  // Download data before questionnaire
  downloadAllTaskData();

  // Now run the questionnaire
  let rows = allTaskData.outcome.length;
  let wins = allTaskData.outcome.reduce((sum, value) => sum + (value === 'win' ? 1 : 0), 0);


  await TaskQuestionnairesMessage(wins, rows);
  await taskQuestionnaire(jsPsych);
  await QuestionnairesMessage();
  await taskQuestionnaire2(jsPsych);

  // Run the timeline
  jsPsych.run(timeline);
}

// Start the experiment
runAllTasks();
