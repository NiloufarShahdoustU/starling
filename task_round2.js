  // for more information about the configuration of the trials and the decks refer to Niloufar Shahdoust (niloufar.shaah@gmail.com) notes.
  //author: Niloufar Shahdoust.
  //////////////////////////////////////////////////////////////vars//////////////////////////////////////////////////////////

  var timeline;
  if (typeof require !== 'undefined') {
    timeline = require('./task_description.js');
  }
  
  var jsPsych = initJsPsych({
    experiment_width: 1000,
    on_finish: function() {
      window.location = "file://155.100.91.44/d/Code/Nill/Starling%20Task/starling/demo.html";
    },
    override_safe_mode: true
  });
  

  var NumberOfTrials = 3; // this has to change to 135 (mix of 45 uni 45 low 45 high)
  var ClassNumber = 3;
  var eachClassTrialNumber = NumberOfTrials / ClassNumber;


  var TotalRewardAmount = 10;
  var RewardAmount = 0.50; // this is added orrrrrr subtracted from the total reward in each trial if it's not timeout!

  ////////////////////////////////////////////////////Functions////////////////////////////////////////////////////////////
  // a function to generate a value between min and max
  function getRandomNumber(minVal, maxVal) {
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // fixed trials for the first round. 
  // fixed trials with uni first, low next, high last
  var trialNumber_fixed_low_first = []; // this means we have uni, low, and then high. trial numbers are: 0...44 for uni, 45...89 for low, 90...134 for high
  for (let i = 0; i < NumberOfTrials; i++) {
    trialNumber_fixed_low_first.push(i);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // fixed trials with uni first, hight next, low last
  var trialNumber_fixed_high_first = []; // this means we have uni, high, and then low trial numbers are: 0...44 for uni, then 90...134 for high and then 45...89 for low
  //creating numbers 0 to 44
  for (let temp_var= 0 * eachClassTrialNumber; temp_var < 1 * eachClassTrialNumber; temp_var++){
    trialNumber_fixed_high_first.push(temp_var);
  }
  //creating numbers 90...134
  for (let temp_var= 2 * eachClassTrialNumber; temp_var < 3 * eachClassTrialNumber; temp_var++){
    trialNumber_fixed_high_first.push(temp_var);
  }
  //creating trials 45...89
  for (let temp_var= 1 * eachClassTrialNumber; temp_var < 2 * eachClassTrialNumber; temp_var++){
    trialNumber_fixed_high_first.push(temp_var);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // mixed trials for the second round. 
  var trialNumber_mixed = []; 
  for (let i = 0; i < NumberOfTrials; i++) { //trial numbers are shuffled
    trialNumber_mixed.push(i);
  }
  trialNumber_mixed = jsPsych.randomization.shuffle(trialNumber_mixed); 


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // see in the console for sanity check:
  // console.log("mixed:", trialNumber_mixed);
  // console.log("fixed high:", trialNumber_fixed_high_first);
  // console.log("fixed low:", trialNumber_fixed_low_first);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // here we need to initiate the decks! there are 6 decks, 2 numbers from each of these 3 distribution.

  deck_number1_uni = [1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9];
  deck_number2_uni = [1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9];
  deck_number1_low = [1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,6,6,6,6,7,7,7,8,8,9];
  deck_number2_low = [1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,6,6,6,6,7,7,7,8,8,9];
  deck_number1_high = [9,9,9,9,9,9,9,9,9,8,8,8,8,8,8,8,8,7,7,7,7,7,7,7,6,6,6,6,6,6,5,5,5,5,5,4,4,4,4,3,3,3,2,2,1];
  deck_number2_high = [9,9,9,9,9,9,9,9,9,8,8,8,8,8,8,8,8,7,7,7,7,7,7,7,6,6,6,6,6,6,5,5,5,5,5,4,4,4,4,3,3,3,2,2,1];



  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // console.log(number1_uni.length,number2_uni.length,number1_low.length,number2_low.length,number1_high.length,number2_high.length);

  //now we need to shuffle all the numbers above.
  // number1_uni = jsPsych.randomization.shuffle(number1_uni); 
  // number2_uni = jsPsych.randomization.shuffle(number2_uni); 
  // number1_low = jsPsych.randomization.shuffle(number1_low); 
  // number2_low = jsPsych.randomization.shuffle(number2_low); 
  // number1_high = jsPsych.randomization.shuffle(number1_high); 
  // number2_high = jsPsych.randomization.shuffle(number2_high); 
  // there was no need to shuffle them, so I just commented the code above for now. 
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // Global variables to store random numbers and decision
  var lastRandomNumber1, lastRandomNumber2, lastDecision, lastTrialType;

  // Define the fixation trial
  var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // we need to have 2 rounds:
  //first round is fixed trials.
      // if button 1 selected: order is uni, low, high
      // if button 2 selected: order is uni, high, low
  // second round is mixed :)


  // TODO: we need to change this and add a button if, if the button is 1 or 2, we need to decide if it's low or high trial

    trialNumberIterate = trialNumber_mixed;
 

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
          temp_rand1_index = getRandomNumber(minNum,maxNum);
          randomNumber1 = deck_number1_uni[temp_rand1_index]; // large card
          deck_number1_uni.splice(temp_rand1_index, 1); // delete element from the deck
          do {
            temp_rand2_index = getRandomNumber(minNum, maxNum);
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
