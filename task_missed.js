
import { RewardAmount, eachClassTrialNumber } from './global_variables.js';

export function runTaskMissed(jsPsych, MissedTrialsInput, rewardInput, blockNumber) {
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


    var lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType, responseRT, trialStartTime;

    var TotalRewardAmount = rewardInput;
    var RepeatedTrial = 1;

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
      choice: [],
      block: [],
      timeoutRepeat:[]
    };
    // Deck initialization

    var trialNumberIterate = MissedTrialsInput.TrialNumber;
    // console.log(trialNumberIterate);

      // Define the fixation trial with two flashes of blackSquare
  var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500,
    on_load: function() {
      let blackSquare = document.getElementById('black-square');
      
      // Add black-square to DOM if not present
      if (!blackSquare) {
        blackSquare = document.createElement("div");
        blackSquare.className = "black-square";
        blackSquare.id = "black-square";
        document.body.appendChild(blackSquare);
      }
  
      // First flash for 100ms
      blackSquare.style.display = 'block';
      setTimeout(() => {
        blackSquare.style.display = 'none';
  
        // Gap of 50ms before the second flash
        setTimeout(() => {
          blackSquare.style.display = 'block';
          setTimeout(() => {
            blackSquare.style.display = 'none';
          }, 100); // Second flash for 100ms
        }, 50); // Gap of 50ms
      }, 100); // End of first flash
    }
  };
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  // Iterate through each trial and add the blank page and fixation trial before the actual trial
    for (let i = 0; i < trialNumberIterate.length; i++) {
      trialData.block.push(blockNumber);
      trialData.timeoutRepeat.push(RepeatedTrial);
      
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
              <div class="black-square" id="black-square"></div>
            </div>
          `;
          
        },
        choices: "NO_KEYS",
        trial_duration: 1000,
        on_load: function() {
          let blackSquare = document.getElementById('black-square');
          
          // Display black square for a single 100 ms flash
          blackSquare.style.display = 'block';
          setTimeout(() => {
            blackSquare.style.display = 'none';
          }, 100); // Flash for 100 ms
        }
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
            <div class="black-square" id="black-square"></div>
          </div>
        `;
        
        },
        choices: [' '], // The key name for space is ' '
        trial_duration: null, // This makes the trial wait indefinitely until 'space' is pressed
        on_load: function() {
          let blackSquare = document.getElementById('black-square');
      
          // Flash the black square for 100 ms
          blackSquare.style.display = 'block';
          setTimeout(() => {
            blackSquare.style.display = 'none';
          }, 100); // Flash for 100 ms
        },
        on_finish: function (data) {
          let blackSquare = document.getElementById('black-square');
          // Flash the black square again for 100 ms when space is pressed
          blackSquare.style.display = 'block';
          setTimeout(() => {
            blackSquare.style.display = 'none';
          }, 100);
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

      choices: "NO_KEYS", // We'll handle keyboard responses manually

      response_ends_trial: false, // We control when the trial ends

      trial_duration: null, // No automatic trial end

      on_load: function() {

        trialStartTime = performance.now();
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
        }, 50); // 50ms delay for card flip
    
        setTimeout(function() {

          var messageElement = document.getElementById('message');

          if (messageElement) {

            messageElement.style.display = 'block';

          } else {

            console.error("Message element not found in the DOM.");

          }

    

          // Flag to check if response has been made

          var responseMade = false;

    

          // Start listening for keyboard responses

          var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({

            callback_function: function(response_info) {

              if (!responseMade) {

                responseMade = true;

    

                // Store response data

                lastDecision = response_info.key;

                responseRT = response_info.rt; // RT from when responses started being accepted

    

                lastTrialType = 'response';

    

                // End the trial

                // jsPsych.pluginAPI.clearAllTimeouts();

                jsPsych.pluginAPI.cancelAllKeyboardResponses();

                jsPsych.finishTrial();

              }

            },

            valid_responses: ['arrowup', 'arrowdown'],

            rt_method: 'performance',

            persist: false,

            allow_held_key: false

          });

    

          // End the trial after 3000ms from when responses started being accepted

          jsPsych.pluginAPI.setTimeout(function() {

            if (!responseMade) {

              responseMade = true;

    

              lastTrialType = 'timeout';

    

              // End the trial

              jsPsych.pluginAPI.cancelAllKeyboardResponses();

              jsPsych.finishTrial();

            }

          }, 3000); // Duration of response window

        }, 500); // Delay before starting to accept responses (adjust as needed)

      },

  on_finish: function(data) {

    var timeElapsed = performance.now() - trialStartTime; // Time since trial started

    console.log('Time Elapsed:', timeElapsed);

  

    var minimumTrialTime = 500 + 3000; // Delay before responses + response window

    var timeRemaining = minimumTrialTime - timeElapsed;

    if (timeRemaining < 0) {
      console.log(`Participant exceeded minimum trial time by ${-timeRemaining} ms`);
    } else {
      console.log(`Time Remaining: ${timeRemaining}`);
    }
    

    

        if (lastTrialType === 'timeout') {


    
          MissedTrialOutput.TrialNumber.push(trialNumberIterate[i]);
          MissedTrialOutput.Number1.push(lastRandomNumber1);
          MissedTrialOutput.Number2.push(lastRandomNumber2);
          trialData.trialType.push('timeout');
          trialData.arrowRT.push('na');
          trialData.outcome.push('na');
          trialData.totalReward.push('na');
          trialData.choice.push('na');
        } else if (lastTrialType === 'response') {

          // Store response data

          trialData.arrowRT.push(responseRT); // RT from when responses started

          trialData.trialType.push('response');

          trialData.choice.push(lastDecision);

        }

        data.timeRemaining = timeRemaining;



    

        // Pass timeRemaining to the next trial

        jsPsych.data.write({ timeRemaining: timeRemaining });

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
                 <div class="black-square" id="black-square"></div>
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
        trial_duration: 2000,
      
        on_load: function() {
          // Only flash the black square if it's a "win" or "lose" message (not a timeout)
          if (lastTrialType === 'response') {
            let blackSquare = document.getElementById('black-square');
            blackSquare.style.display = 'block';
            setTimeout(() => {
              blackSquare.style.display = 'none';
            }, 100); // Flash for 100 ms
          }
        }
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
              <div class="black-square" id="black-square"></div>
            </div>
          `;
  
          
        },
        choices: "NO_KEYS",
        trial_duration: 1000,
        on_load: function() {
          // Flash black square only if there's a reward feedback (not on timeout)
          if (lastTrialType === 'response') {
            let blackSquare = document.getElementById('black-square');
            blackSquare.style.display = 'block';
            setTimeout(() => {
              blackSquare.style.display = 'none';
            }, 100); // Flash for 100 ms
          }
        }
      };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      timeline.push(blankPage);
      timeline.push(fixation);
      timeline.push(showImages);
      timeline.push(showText);
      timeline.push(revealImage);
      timeline.push(showBothImagesOrTimeout);
      timeline.push(showRewardFeedback);


      

    } // trial for loop
  
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        jsPsych.endExperiment();
        console.log('Trial ended by the user, data saved')
        resolve([MissedTrialOutput, TotalRewardAmount, trialData]) // these are output
      }
    });
  
  jsPsych.run(timeline);
  })

}

