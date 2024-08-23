import { runTaskRound1 } from './task_round1.js';

// Initialize jsPsych
const jsPsych = initJsPsych();

// Number of Trials and Setup
const NumberOfTrials = 3;
const ClassNumber = 3;
const eachClassTrialNumber = NumberOfTrials / ClassNumber;



// Fixed trials for the first round
const trialNumber_fixed_low_first = [];
for (let i = 0; i < NumberOfTrials; i++) {
  trialNumber_fixed_low_first.push(i);
}

// Fixed trials with uni first, high next, low last
const trialNumber_fixed_high_first = [];
for (let temp_var = 0 * eachClassTrialNumber; temp_var < 1 * eachClassTrialNumber; temp_var++) {
  trialNumber_fixed_high_first.push(temp_var);
}
for (let temp_var = 2 * eachClassTrialNumber; temp_var < 3 * eachClassTrialNumber; temp_var++) {
  trialNumber_fixed_high_first.push(temp_var);
}
for (let temp_var = 1 * eachClassTrialNumber; temp_var < 2 * eachClassTrialNumber; temp_var++) {
  trialNumber_fixed_high_first.push(temp_var);
}

// Mixed trials for the second round
let trialNumber_mixed = [];
for (let i = 0; i < NumberOfTrials; i++) {
  trialNumber_mixed.push(i);
}
trialNumber_mixed = jsPsych.randomization.shuffle(trialNumber_mixed);


function runAllTasks() {
  console.log("Starting first task round...");
  runTaskRound1(jsPsych, trialNumber_fixed_low_first).then(() => {
    console.log("First task round completed.");
    console.log("Starting second task round...");
    runTaskRound1(jsPsych, trialNumber_fixed_high_first).then(() => {
      console.log("Second task round completed.");
    })
  })
  // console.log("First task round completed.");

  // console.log("Starting second task round...");
  // await runTaskRound1(jsPsych, trialNumber_fixed_high_first);
  // console.log("Second task round completed.");

  // console.log("Starting third task round...");
  // await runTaskRound1(jsPsych, trialNumber_mixed);
  // console.log("Third task round completed.");
}

runAllTasks();
