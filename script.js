import { NumberOfTrials, ClassNumber, eachClassTrialNumber } from './global_variables.js';
import { runTask } from './task.js';
import { taskDescription } from './task_description.js';

// Initialize jsPsych
const jsPsych = initJsPsych();



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

  console.log("Starting description");
  taskDescription().then((orderNumber) => {
    console.log("Description finished");
    console.log("Starting first task round...");
    // if order number is 1 this is the flow: uni, low, high, then mixture of all these (total of 270 trials)
    if (orderNumber==1){
      runTask(jsPsych, trialNumber_fixed_low_first).then(() => {
        console.log("First task round completed.");
        console.log("Starting second task round...");
        runTask(jsPsych, trialNumber_mixed).then(() => {
          console.log("Second task round completed.");
        })
      })
    } else{ // if order number is 2 this is the flow: uni, high, low, then mixture of all these  (total of 270 trials)
      runTask(jsPsych, trialNumber_fixed_high_first).then(() => {
        console.log("First task round completed.");
        console.log("Starting second task round...");
        runTask(jsPsych, trialNumber_mixed).then(() => {
          console.log("Second task round completed.");
        })
      })
    }
  })

}

runAllTasks();
