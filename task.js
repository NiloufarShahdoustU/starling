import { deck_number1_uni, deck_number2_uni, deck_number1_low, deck_number2_low, deck_number1_high, deck_number2_high, NumberOfTrials, ClassNumber, eachClassTrialNumber } from './global_variables.js';
import { deck_number1_uni_selected, deck_number2_uni_selected, deck_number1_low_selected, deck_number2_low_selected, deck_number1_high_selected, deck_number2_high_selected} from './global_variables.js';

export function runTask(jsPsych, trialNumberIterate_input) {
  // Initialize jsPsych here if it's not initialized elsewhere
  return new Promise((resolve, reject) => {
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        resolve()
      } 
    });

    const timeline = [];

    function getRandomNumber(minVal, maxVal) {
      return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    }

    var lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType;


    var TotalRewardAmount = 10;
    const RewardAmount = 0.50;

    // Deck initialization

    var trialNumberIterate =trialNumberIterate_input;
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
    for (let i = 0; i < NumberOfTrials; i++) {

      console.log(deck_number2_high[44]);

          // Check if i is a multiple of 3
    if (i % (3-1) === 0 && i !== 0) { // Skip adding rest for the first trial (i=0)
      var restScreen = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size: 30px;">You can have some rest! <br>press <b>C</b> to continue.</div>',
        choices: ['c'], // Space key to continue
        trial_duration: null // Wait indefinitely for the space key
      };
      timeline.push(restScreen);
    }
  
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
  
      timeline.push(blankPage);
  
      // Add the fixation trial
      timeline.push(fixation);
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
          const maxNum = 44; // maximum value 44
    
      
          if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
            imgFolder = "uniform";
            var temp_rand1_index = getRandomNumber(minNum,maxNum);
            console.log({temp_rand1_index});
            randomNumber1 = deck_number1_uni[temp_rand1_index]; // large card
            deck_number1_uni.splice(temp_rand1_index, 1); // delete element from the deck
            do {
              var temp_rand2_index = getRandomNumber(minNum, maxNum);
              console.log({temp_rand2_index});
              randomNumber2 = deck_number2_uni[temp_rand2_index]; // small card
              if (randomNumber1 !== randomNumber2) {
                deck_number2_uni.splice(temp_rand2_index, 1);
              }
          } while (randomNumber2 === randomNumber1); // ensure they are different
      
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
            
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
            
            temp_rand1_index = getRandomNumber(minNum,maxNum);
            console.log({temp_rand1_index});
            randomNumber1 = deck_number1_low[temp_rand1_index]; // large card
            deck_number1_low.splice(temp_rand1_index, 1); // delete element from the deck
  
            do {
              temp_rand2_index = getRandomNumber(minNum, maxNum);
              console.log({temp_rand2_index});
              randomNumber2 = deck_number2_low[temp_rand2_index]; // small card
              if (randomNumber1 !== randomNumber2) {
                deck_number2_low.splice(temp_rand2_index, 1);
              }
          } while (randomNumber2 === randomNumber1); // ensure they are different
  
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
      
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
            temp_rand1_index = getRandomNumber(minNum,maxNum);
            console.log({temp_rand1_index});
            randomNumber1 = deck_number1_high[temp_rand1_index]; // large card
            deck_number1_high.splice(temp_rand1_index, 1); // delete element from the deck
  
            do {
              temp_rand2_index = getRandomNumber(minNum, maxNum);
              console.log({temp_rand2_index});
              randomNumber2 = deck_number2_high[temp_rand2_index]; // small card
              if (randomNumber1 !== randomNumber2) {
                deck_number2_high.splice(temp_rand2_index, 1);
              }
          } while (randomNumber2 === randomNumber1); // ensure they are different
  
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
          }
      
          lastRandomNumber1 = randomNumber1;
          lastRandomNumber2 = randomNumber2;
      
          // Set timeout to replace the back image with the front image after the flip animation
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
      
          if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
            imgFolder = "uniform";
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
          }
      
          var message = '';
          var messageColor = '';
          if (lastTrialType === 'response') {
            if ((lastRandomNumber1 < lastRandomNumber2 && lastDecision === 'arrowup') || 
                (lastRandomNumber1 > lastRandomNumber2 && lastDecision === 'arrowdown')) {
              message = 'you win!';
              messageColor = 'green';
            } else {
              message = 'you lose!';
              messageColor = 'red';
            }
          }
      
          if (lastTrialType === 'response') {
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
  
      // Add trials to the timeline
      timeline.push(showImages);
      timeline.push(showText);
      timeline.push(revealImage);
      timeline.push(showBothImagesOrTimeout);
      timeline.push(showRewardFeedback);
  
  
    } // trial for loop
  
  
  
  jsPsych.run(timeline);
  
    // jsPsych.on('finish', () => {
    //   resolve('Experiment completed');
    // });

  })

}

