// import jsPsychHtmlKeyboardResponse from './jspsych/dist/plugin-html-keyboard-response.js';

export function runTaskRound1(jsPsych, trialNumberIterate_input) {
  // Initialize jsPsych here if it's not initialized elsewhere
  return new Promise((resolve, reject) => {
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        resolve()
      } 
    });

    const timeline = [];
    const NumberOfTrials = 9;
    const ClassNumber = 3;
    const eachClassTrialNumber = NumberOfTrials / ClassNumber;
    

    function getRandomNumber(minVal, maxVal) {
      return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    }

    var lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType;


    var TotalRewardAmount = 10;
    const RewardAmount = 0.50;

    // Deck initialization
    const deck_number1_uni = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9];
    const deck_number2_uni = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9];
    const deck_number1_low = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9];
    const deck_number2_low = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9];
    const deck_number1_high = [9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1];
    const deck_number2_high = [9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1];

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
            randomNumber1 = deck_number1_uni[temp_rand1_index]; // large card
            deck_number1_uni.splice(temp_rand1_index, 1); // delete element from the deck
            do {
              var temp_rand2_index = getRandomNumber(minNum, maxNum);
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
            randomNumber1 = deck_number1_low[temp_rand1_index]; // large card
            deck_number1_low.splice(temp_rand1_index, 1); // delete element from the deck
  
            do {
              temp_rand2_index = getRandomNumber(minNum, maxNum);
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
            randomNumber1 = deck_number1_high[temp_rand1_index]; // large card
            deck_number1_high.splice(temp_rand1_index, 1); // delete element from the deck
  
            do {
              temp_rand2_index = getRandomNumber(minNum, maxNum);
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

