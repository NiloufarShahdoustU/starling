
import { RewardAmount, eachClassTrialNumber } from './global_variables.js';

export function runTaskMissed(jsPsych, MissedTrialsInput, rewardInput) {
  // Initialize jsPsych here if it's not initialized elsewhere
  // trialNumberIterate_input is the order of trials. 
  return new Promise((resolve, reject) => {
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        resolve([MissedTrialOutput, TotalRewardAmount, trialData]) // these are output
      } 
    });

    var timeline = [];


    var lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType;


    var TotalRewardAmount = rewardInput;

    // Deck initialization
    

    var MissedTrialOutput = {
      TrialNumber: [],
      Number1: [],
      Number2: []
    };
    
    

    var trialData = {
      trialIndex: [],
      spaceRT: [],
      arrowRT: [],
      outcome: [],
      distribution: [],
      totalReward: [],
      trialType: [],
      myCard: [],
      yourCard: [],
      interTrialInterval: [],
      choice: []
    };
    // Deck initialization

    var trialNumberIterate = MissedTrialsInput.TrialNumber;
    // console.log(trialNumberIterate);
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
          // console.log(trialClass);
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
            <div class="reveal-text">
              press <b>SPACE</b> to reveal your card <br>
              
              my card is higher <span style="color: green; font-size: 24px;">&#8593;</span> arrow<br>
              my card is lower <span style="color: red; font-size: 24px;">&#8595;</span> arrow
            </div>
          </div>
        `;
        
        },
        choices: [' '], // The key name for space is ' '
        trial_duration: null, // This makes the trial wait indefinitely until 'space' is pressed
        on_finish: function (data) {
          trialData.spaceRT.push(data.rt+1000);  // RT when space is pressed (1000 is added to it because
          // because the message is shown 1000ms after card onset)
          trialData.trialIndex.push(trialNumberIterate[i]);
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
  
          
      
          if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
            imgFolder = "uniform";
            randomNumber1 = MissedTrialsInput.Number1[i]; // large card
            randomNumber2 =  MissedTrialsInput.Number2[i]; // small card
            // console.log("random number1:", randomNumber1);
            // console.log("random number2:", randomNumber2);
            
          } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
            imgFolder = "low";
            randomNumber1 = MissedTrialsInput.Number1[i]; // large card
            randomNumber2 =  MissedTrialsInput.Number2[i]; // small card
            // console.log("random number1:", randomNumber1);
            // console.log("random number2:", randomNumber2);
      
          } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
            imgFolder = "high";
            randomNumber1 = MissedTrialsInput.Number1[i]; // large card
            randomNumber2 =  MissedTrialsInput.Number2[i]; // small card
            // console.log("random number1:", randomNumber1);
            // console.log("random number2:", randomNumber2);
          }
      
          lastRandomNumber1 = randomNumber1;
          lastRandomNumber2 = randomNumber2;
          jsPsych.data.write({ imgFolder: imgFolder });

          trialData.myCard.push(randomNumber1);  // Store random number 1
          trialData.yourCard.push(randomNumber2);  // Store random number 2
      
          // setTimeout(function() {
          //   var revealedCard = document.getElementById('revealed-card');
          //   revealedCard.src = `img/${imgFolder}/${randomNumber1}.jpg`;
          //   revealedCard.classList.remove('flip');
          //   revealedCard.classList.add('flip-reveal');
          // }, 250); // Flip duration is 0.25 second
          
      
          return `
          <div class="trial-container">
            <img src="img/${imgFolder}/back.jpg" class="large-image flip" id="revealed-card">
            <img src="img/${imgFolder}/back.jpg" class="small-image" id="small-card">
                            
            <div id="message" style="display: none; font-weight: bold; font-family: Arial, sans-serif; bottom: 2cm; position: absolute;">

            </div>
    
          </div>
        `;
      },
      choices: 'NO_KEYS', // Initially, no keys are allowed
      trial_duration: 3000, 
      on_load: function() {
        var lastData = jsPsych.data.getLastTrialData().values()[0];
        var imgFolder = lastData.imgFolder;
    
        // Play the flip sound
        var flipSound = new Audio('sound/flip.wav');  
        flipSound.play();
    
        // Flip the card after the trial starts
        var revealedCard = document.getElementById('revealed-card');
        setTimeout(function() {
          // Show the front of the card after 100ms
          revealedCard.src = `img/${imgFolder}/${lastRandomNumber1}.jpg`;
          revealedCard.classList.add('flip-reveal');
        }, 50); // 100ms delay for card flip
    
        // Show the message after 1000ms and enable key responses
        setTimeout(function() {
          document.getElementById('message').style.display = 'block';
    
          // Now enable the arrow key responses
          jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: function(response_info) {
              jsPsych.finishTrial({
                response: response_info.key,
                rt: response_info.rt
              });
            },
            valid_responses: ['arrowup', 'arrowdown'],
            rt_method: 'performance',
            persist: false, // Only register the first response
            allow_held_key: false
          });
        }, 1000); // Delay for 1000ms to show message and allow responses
      },
      on_finish: function(data) {
        if (data.response === null) { 
          lastTrialType = 'timeout'; 
    
          MissedTrialOutput.TrialNumber.push(trialNumberIterate[i]);
          MissedTrialOutput.Number1.push(lastRandomNumber1);
          MissedTrialOutput.Number2.push(lastRandomNumber2);
          trialData.trialType.push('timeout');
          trialData.arrowRT.push('na');
          trialData.outcome.push('na');
          trialData.totalReward.push('na');
          trialData.choice.push('na');
        } else {
          // Store the decision response
          lastDecision = data.response;
          lastTrialType = 'response';
          trialData.arrowRT.push(data.rt + 1000);  // RT for arrow key, adjusted for 1000ms delay
          trialData.trialType.push('response');
        }
      
        // Disable keyboard input after this point
        jsPsych.pluginAPI.cancelAllKeyboardResponses();
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

              var winSound = new Audio('sound/win.wav'); // play win sound
              winSound.play();

              message = 'you win!';
              messageColor = 'green';
              trialData.outcome.push('win');
            } else {

              var loseSound = new Audio('sound/lose.wav'); // play lose sound
              loseSound.play();

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
        trial_duration: 2000
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
          trialData.choice.push(lastDecision);
          
          return `
            <div class="trial-container">
              <div class="center" style="font-size: 55px; font-weight: bold; color: black;">Total: $ ${TotalRewardAmount.toFixed(2)}</div>
                      <div class="center" style="font-size: 55px; font-weight: bold; color: ${rewardChangeColor}; margin-top: 30px;">$ ${rewardChangeText}</div>
  
            </div>
          `;
  
          
        },
        choices: "NO_KEYS",
        trial_duration: 1000
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

