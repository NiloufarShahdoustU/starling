
import { RewardAmount, eachClassTrialNumber } from './global_variables.js';

export function runTaskMissed(jsPsych, MissedTrialsInput, rewardInput) {
  // Initialize jsPsych here if it's not initialized elsewhere
  // trialNumberIterate_input is the order of trials. 
  return new Promise((resolve, reject) => {
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        resolve([MissedTrialOutput, TotalRewardAmount]) // these are output
      } 
    });

    var timeline = [];


    var lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType;


    var TotalRewardAmount = rewardInput;

    var MissedTrialOutput = {
      TrialNumber: [],
      Number1: [],
      Number2: []
    };
    

    // Deck initialization

    var trialNumberIterate = MissedTrialsInput.TrialNumber;
    console.log(trialNumberIterate);
    // Define the fixation trial
    var fixation = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: "NO_KEYS",
      trial_duration: 500
    };
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  // Iterate through each trial and add the blank page and fixation trial before the actual trial
    for (let i = 0; i < trialNumberIterate.length; i++) {
      
      // Add a blank page with a random duration between 750 and 1000 ms
      var blankPage = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '',
        choices: "NO_KEYS",
        trial_duration: function() {
          var duration = Math.floor(Math.random() * (1000 - 750 + 1)) + 750;
          return duration;
        }
      };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
      // Part 1: Display the images
      var showImages = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
          var trialClass = trialNumberIterate[i];
          console.log(trialClass);
          var imgFolder = "";
  
          //here based on the trial number we decide which distribution the trial comes from. and that is:
          //  0...44 for uni, 45...89 for low, 90...134 for high
  
          if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
            imgFolder = "uniform";
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
          }
  
          return `
            <div class="trial-container">
              <img src="img/${imgFolder}/back.jpg" class="large-image">
              <img src="img/${imgFolder}/back.jpg" class="small-image">
            </div>
          `;
          
        },
        choices: "NO_KEYS",
        trial_duration: 1000
      };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
      // Part 2: Display the text and enable 'space' key response
      var showText = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
          var trialClass = trialNumberIterate[i];
          var imgFolder = "";
  
          if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
            imgFolder = "uniform";
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
          }
  
          return `
            <div class="trial-container">
              <img src="img/${imgFolder}/back.jpg" class="large-image">
              <img src="img/${imgFolder}/back.jpg" class="small-image">
              <div class="reveal-text">press <b>SPACE</b> to reveal your card</div>
            </div>
          `;
        },
        choices: [' '], // The key name for space is ' '
        trial_duration: null // This makes the trial wait indefinitely until 'space' is pressed
      };
  
  
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // part 3
  
      var revealImage = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
          var trialClass = trialNumberIterate[i];
          var imgFolder = "";
          var randomNumber1, randomNumber2;
  
          //
          const minNum = 0;  // minimum value 0
          const maxNum = 44; // maximum value 44 (the number of elements in each distribution is 45 and we want to get an index of those numbers)
    
      
          if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
            imgFolder = "uniform";
            randomNumber1 = MissedTrialsInput.Number1[i]; // large card
            randomNumber2 =  MissedTrialsInput.Number2[i]; // small card
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
            
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
            randomNumber1 = MissedTrialsInput.Number1[i]; // large card
            randomNumber2 =  MissedTrialsInput.Number2[i]; // small card
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
      
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
            randomNumber1 = MissedTrialsInput.Number1[i]; // large card
            randomNumber2 =  MissedTrialsInput.Number2[i]; // small card
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
          }
      
          lastRandomNumber1 = randomNumber1;
          lastRandomNumber2 = randomNumber2;
      
          setTimeout(function() {
            var revealedCard = document.getElementById('revealed-card');
            revealedCard.src = `img/${imgFolder}/${randomNumber1}.jpg`;
            revealedCard.classList.remove('flip');
            revealedCard.classList.add('flip-reveal');
          }, 250); // Flip duration is 0.25 second
          
      
          return `
            <div class="trial-container">
              <img src="img/${imgFolder}/back.jpg" class="large-image flip" id="revealed-card">
              <img src="img/${imgFolder}/back.jpg" class="small-image" id="small-card">
              <div class="reveal-text">play (up arrow)<br>hold (down arrow)</div>
            </div>
          `;
        
        },
        choices: ['arrowup', 'arrowdown'], // Allow responses using up and down arrows
        trial_duration: 3000, // 3000ms wait
        on_finish: function(data) {
          if (data.response === null) { // If no response
            lastTrialType = 'timeout'; // Mark this trial as a timeout
    
            MissedTrialOutput.TrialNumber.push(trialNumberIterate[i]);
            MissedTrialOutput.Number1.push(lastRandomNumber1);
            MissedTrialOutput.Number2.push(lastRandomNumber2);
            console.log("Missed Trial Added:", MissedTrialOutput); // Check here if trials are being added

          } else {
            // Store the decision response
            lastDecision = data.response;
            lastTrialType = 'response';
          }
        }
      };
      
  
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
      // Part 4: Show both images based on the decision or timeout
      var showBothImagesOrTimeout = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
          var trialClass = trialNumberIterate[i];
          var imgFolder = "";
          var message = '';
          var messageColor = '';
      
          if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
            imgFolder = "uniform";
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
          }
      
          if (lastTrialType === 'response') {
            if ((lastRandomNumber1 < lastRandomNumber2 && lastDecision === 'arrowup') || 
                (lastRandomNumber1 > lastRandomNumber2 && lastDecision === 'arrowdown')) {
              message = 'you win!';
              messageColor = 'green';
            } else {
              message = 'you lose!';
              messageColor = 'red';
            }
            return `
              <div class="trial-container">
                <div class="message" style="color: ${messageColor}; font-size: 60px; font-weight: bold; position: absolute; top: 100px;">${message}</div>
                <img src="img/${imgFolder}/${lastRandomNumber1}.jpg" class="large-image" id="revealed-card">
                <img src="img/${imgFolder}/${lastRandomNumber2}.jpg" class="small-image">
              </div>
            `;
          } else {
      
            return `
              <div class="trial-container">
                <div class="timeout-message">
                  <div class="center" style="margin-top: 20px;">
                    <p style="font-size: 20px; text-align: center;"><b>Time is up!</b></p>
                    <p style="font-size: 20px; text-align: center;"><b>Please respond faster!</b></p>
                  </div>
                </div>
              </div>
            `;
          }
        },
        choices: "NO_KEYS",
        trial_duration: 1000
      };
      
      
  
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
      // Part 5: Show reward feedback
      var showRewardFeedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
          var rewardChange = 0;
          var rewardChangeText = '';
          var rewardChangeColor = '';
          //console.log('showRewardFeedback lastTrialData:', { lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType }); // Log lastTrialData to verify contents
  
          if (lastTrialType === 'response') {
            if ((lastRandomNumber1 < lastRandomNumber2 && lastDecision === 'arrowup') || 
                (lastRandomNumber1 > lastRandomNumber2 && lastDecision === 'arrowdown')) {
              rewardChange = RewardAmount;
              rewardChangeText = `+${RewardAmount}`;
              rewardChangeColor = 'green';
            } else {
              rewardChange = -RewardAmount;
              rewardChangeText = `-${RewardAmount}`;
              rewardChangeColor = 'red';
            }
            TotalRewardAmount += rewardChange;
          }
          else {
            return `
              <div class="trial-container">
                <div class="timeout-message">
                  <div class="center" style="margin-top: 20px;">
                    <p style="font-size: 20px; text-align: center;"><b>Time is up!</b></p>
                    <p style="font-size: 20px; text-align: center;"><b>Please respond faster!</b></p>
                  </div>
                </div>
              </div>
            `;
          }
  
          return `
            <div class="trial-container">
              <div class="center" style="font-size: 55px; font-weight: bold; color: black;">Total: $ ${TotalRewardAmount.toFixed(2)}</div>
                      <div class="center" style="font-size: 55px; font-weight: bold; color: ${rewardChangeColor}; margin-top: 30px;">$ ${rewardChangeText}</div>
  
            </div>
          `;
  
          
        },
        choices: "NO_KEYS",
        trial_duration: 500
      };
      timeline.push(blankPage);
      timeline.push(fixation);
      timeline.push(showImages);
      timeline.push(showText);
      timeline.push(revealImage);
      timeline.push(showBothImagesOrTimeout);
      timeline.push(showRewardFeedback);


      

    } // trial for loop
  
  
  
  jsPsych.run(timeline);
  })

}

