import { NumberOfTrials, ClassNumber, eachClassTrialNumber } from './global_variables.js';
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


// Fixed trials with uni first, high next, low last
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


var Missed = {  // this is only used once, when the first time 
  TrialNumber: [],
  Number1: [],
  Number2: []
};

function runAllTasks() {

  console.log("Starting description");
  taskDescription().then((orderNumber) => {
    console.log("Description finished");
    console.log("Starting first round...");
    // if order number is 1 this is the flow: uni, low, high, then mixture of all these (total of 270 trials)
    if (orderNumber==1){
      runTask(jsPsych, trialNumber_fixed_uni, Missed).then((MissedTrials) => {
        console.log("First round completed.");
        console.log("Starting second round...");
        // console.log("missed trials", MissedTrials);
        
        runTask(jsPsych, trialNumber_fixed_low_first,MissedTrials ).then((MissedTrials) => {
          console.log("Second round completed.");
          console.log("Starting third round...");
          runTask(jsPsych, trialNumber_fixed_high_first).then((MissedTrials) => {
          console.log("third round completed.");
          console.log("Starting mixed round 1");
          runTask(jsPsych, trialNumber_mixed.slice(0*eachClassTrialNumber, 1*eachClassTrialNumber)).then((MissedTrials) => {
            console.log("mixed round 1 completed.");
            console.log("Starting mixed round 2 ");
          runTask(jsPsych, trialNumber_mixed.slice(1*eachClassTrialNumber, 2*eachClassTrialNumber)).then((MissedTrials) => {
            console.log("mixed round 2 completed.");
            console.log("Starting mixed round 3 ");
          runTask(jsPsych, trialNumber_mixed.slice(2*eachClassTrialNumber, 3*eachClassTrialNumber)).then((MissedTrials) => {
            console.log("mixed round 3 completed.");
                })  
              })
            })
          })
        })


        
      })
    } else{ // if order number is 2 this is the flow: uni, high, low, then mixture of all these  (total of 270 trials)
      runTask(jsPsych, trialNumber_fixed_uni).then((MissedTrials) => {
        console.log("First round completed.");
        console.log("Starting second round...");
        // console.log("missed trials", MissedTrials);
        runTask(jsPsych, trialNumber_fixed_high_first).then((MissedTrials) => {
          console.log("Second round completed.");
          console.log("Starting third round...");
          runTask(jsPsych, trialNumber_fixed_low_first).then((MissedTrials) => {
          console.log("third round completed.");
          console.log("Starting mixed round 1");
          runTask(jsPsych, trialNumber_mixed.slice(0*eachClassTrialNumber, 1*eachClassTrialNumber)).then((MissedTrials) => {
            console.log("mixed round 1 completed.");
            console.log("Starting mixed round 2 ");
          runTask(jsPsych, trialNumber_mixed.slice(1*eachClassTrialNumber, 2*eachClassTrialNumber)).then((MissedTrials) => {
            console.log("mixed round 2 completed.");
            console.log("Starting mixed round 3 ");
          runTask(jsPsych, trialNumber_mixed.slice(2*eachClassTrialNumber, 3*eachClassTrialNumber)).then((MissedTrials) => {
            console.log("mixed round 3 completed.");
                })  
              })
            })
          })
        })
      })
    }
  })
}

runAllTasks();
