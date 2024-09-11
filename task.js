import { deck_number1_uni, deck_number2_uni, deck_number1_low, deck_number2_low, deck_number1_high, deck_number2_high, eachClassTrialNumber } from './global_variables.js';
import{ RewardAmount} from './global_variables.js';

export function runTask(jsPsych, trialNumberIterate_input, rewardInput) {
  // Initialize jsPsych here if it's not initialized elsewhere
  // trialNumberIterate_input is the order of trials. 
  return new Promise((resolve, reject) => {
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        resolve([MissedTrial, TotalRewardAmount, trialData]) // these guys are output
      } 
    });

    var timeline = [];

    function getRandomNumber(minVal, maxVal) {
      return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    }

    var lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType;


    var TotalRewardAmount = rewardInput; 


    // Deck initialization

    var trialNumberIterate = trialNumberIterate_input;
    console.log(trialNumberIterate);
    // Define the fixation trial
    var fixation = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: "NO_KEYS",
      trial_duration: 500
    };
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    var deck_number1_uni_selected = Array(deck_number1_uni.length).fill(0);
    var deck_number2_uni_selected = Array(deck_number1_uni.length).fill(0);
    var deck_number1_low_selected = Array(deck_number1_uni.length).fill(0);
    var deck_number2_low_selected = Array(deck_number1_uni.length).fill(0);
    var deck_number1_high_selected = Array(deck_number1_uni.length).fill(0);
    var deck_number2_high_selected = Array(deck_number1_uni.length).fill(0); 

    var trialData = {
      trialNumber: [],
      spaceRT: [],
      arrowRT: [],
      outcome: [],
      distribution: [],
      totalReward: [],
      trialType: [],
      randomNumber1: [],
      randomNumber2: [],
      interTrialInterval: []
    };


    var MissedTrial = {
      TrialNumber: [],
      Number1: [],
      Number2: []
    };
    

  
  // Iterate through each trial and add the blank page and fixation trial before the actual trial
    for (let i = 0; i < eachClassTrialNumber; i++) {

      // I need to put the rest page before beginning of each task and NOT after the first one
      if (i == 0 && trialNumberIterate[i] != 0 && trialNumberIterate[i+1] != 1 && trialNumberIterate[i+2] != 2) {  
        var restScreen = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="font-size: 30px;">You can have some rest! <br>press <b>C</b> to continue.</div>',
            choices: ['c'], 
            trial_duration: null 
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
          trialData.interTrialInterval.push(duration);
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

          trialData.distribution.push(imgFolder);
  
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
        trial_duration: null, // This makes the trial wait indefinitely until 'space' is pressed
        on_finish: function (data) {
          trialData.spaceRT.push(data.rt);  // RT when space is pressed
          trialData.trialNumber.push(i);  // Store trial number
        }

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
            var temp_rand1_index;;
            do {
              temp_rand1_index = getRandomNumber(minNum, maxNum);
            } while (deck_number1_uni_selected[temp_rand1_index] === 1);
            randomNumber1 = deck_number1_uni[temp_rand1_index]; // large card
            deck_number1_uni_selected[temp_rand1_index] = 1; // chosen flag =1;
            // console.log({deck_number1_uni_selected});


          var temp_rand2_index;
          do {
              do {
                  temp_rand2_index = getRandomNumber(minNum, maxNum);
              } while (deck_number2_uni_selected[temp_rand2_index] === 1); // Check if the index is already selected
              
              randomNumber2 = deck_number2_uni[temp_rand2_index]; // small card
              
              if (randomNumber1 !== randomNumber2) {
                  deck_number2_uni_selected[temp_rand2_index] = 1; // mark the element as selected
              }
          } while (randomNumber2 === randomNumber1); // ensure they are different
          // console.log({deck_number2_uni_selected});

      
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
            
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
            
            var temp_rand1_index;;
            do {
              temp_rand1_index = getRandomNumber(minNum, maxNum);
            } while (deck_number1_low_selected[temp_rand1_index] === 1);
            randomNumber1 = deck_number1_low[temp_rand1_index]; // large card
            deck_number1_low_selected[temp_rand1_index] = 1; // chosen flag =1;
            // console.log({deck_number1_low_selected});


          var temp_rand2_index;
          do {
              do {
                  temp_rand2_index = getRandomNumber(minNum, maxNum);
              } while (deck_number2_low_selected[temp_rand2_index] === 1); // Check if the index is already selected
              
              randomNumber2 = deck_number2_low[temp_rand2_index]; // small card
              
              if (randomNumber1 !== randomNumber2) {
                deck_number2_low_selected[temp_rand2_index] = 1; // mark the element as selected
              }
          } while (randomNumber2 === randomNumber1); // ensure they are different
          // console.log({deck_number2_low_selected});
  
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
      
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
            var temp_rand1_index;;
            do {
              temp_rand1_index = getRandomNumber(minNum, maxNum);
            } while (deck_number1_high_selected[temp_rand1_index] === 1);
            randomNumber1 = deck_number1_high[temp_rand1_index]; // large card
            deck_number1_high_selected[temp_rand1_index] = 1; // chosen flag =1;
            // console.log({deck_number1_high_selected});

          var temp_rand2_index;
          do {
              do {
                  temp_rand2_index = getRandomNumber(minNum, maxNum);
              } while (deck_number2_high_selected[temp_rand2_index] === 1); // Check if the index is already selected
              
              randomNumber2 = deck_number2_high[temp_rand2_index]; // small card
              
              if (randomNumber1 !== randomNumber2) {
                deck_number2_high_selected[temp_rand2_index] = 1; // mark the element as selected
              }
          } while (randomNumber2 === randomNumber1); // ensure they are different
          // console.log({deck_number2_high_selected});

  
            console.log("random number1:", randomNumber1);
            console.log("random number2:", randomNumber2);
          }
      
          lastRandomNumber1 = randomNumber1;
          lastRandomNumber2 = randomNumber2;

          trialData.randomNumber1.push(randomNumber1);  // Store random number 1
          trialData.randomNumber2.push(randomNumber2);  // Store random number 2
      
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
                            
              <div class="reveal-text" style="font-weight: bold; font-family: Arial, sans-serif;">
                my card is higher <span style="color: green; font-size: 24px;">&#8593;</span> arrow<br>
                my card is lower <span style="color: red; font-size: 24px;">&#8595;</span> arrow
              </div>

            </div>
          `;
        
        },
        choices: ['arrowup', 'arrowdown'], // Allow responses using up and down arrows
        trial_duration: 3000, // 3000ms wait
        on_finish: function(data) {
          if (data.response === null) { // If no response
            lastTrialType = 'timeout'; // Mark this trial as a timeout
    
            MissedTrial.TrialNumber.push(trialNumberIterate[i]);
            MissedTrial.Number1.push(lastRandomNumber1);
            MissedTrial.Number2.push(lastRandomNumber2);
            console.log("Missed Trial Added:", MissedTrial); // Check here if trials are being added
            trialData.trialType.push('timeout');

          } else {
            // Store the decision response
            lastDecision = data.response;
            lastTrialType = 'response';
            trialData.arrowRT.push(data.rt);  // RT for arrow key
            trialData.trialType.push('response');
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
            if ((lastRandomNumber1 > lastRandomNumber2 && lastDecision === 'arrowup') || 
                (lastRandomNumber1 < lastRandomNumber2 && lastDecision === 'arrowdown')) {
              message = 'you win!';
              messageColor = 'green';
              trialData.outcome.push('win');
            } else {
              message = 'you lose!';
              messageColor = 'red';
              trialData.outcome.push('lose');
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
            if ((lastRandomNumber1 > lastRandomNumber2 && lastDecision === 'arrowup') || 
                (lastRandomNumber1 < lastRandomNumber2 && lastDecision === 'arrowdown')) {
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
          trialData.totalReward.push(TotalRewardAmount);
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

