// If using modules
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

var trialNumber = 9;
var ClassNumber = 3;
var eachClassTrialNumber = trialNumber / ClassNumber;

var trialClasses = [];
for (let i = 0; i < trialNumber; i++) {
  trialClasses.push(i);
}

trialClasses = jsPsych.randomization.shuffle(trialClasses);
console.log(trialClasses);

var TotalRewardAmount = 10;
const RewardAmount = 0.50; // this is added to subtracted from the total reward in each trial if it's not timeout!

// Global variables to store random numbers and decision
var lastRandomNumber, lastRandomNumber2, lastDecision, lastTrialType;

// Define the fixation trial
var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 500
};

// Define the timeout message trial
var timeoutMessage = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="trial-container">
      <div class="timeout-message">
        <div class="center" style="margin-top: 20px;">
          <p style="font-size: 20px; text-align: center;"><b>Time is up!</b></p>
          <p style="font-size: 20px; text-align: center;"><b>Please respond faster!</b></p>
        </div>
      </div>
    </div>
  `,
  choices: "NO_KEYS",
  trial_duration: 1000
};

// Iterate through each trial and add the blank page and fixation trial before the actual trial
for (let i = 0; i < trialNumber; i++) {

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

  // Part 1: Display the images
  var showImages = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var trialClass = trialClasses[i];
      console.log(trialClass);
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
        </div>
      `;
    },
    choices: "NO_KEYS",
    trial_duration: 1000
  };

  // Part 2: Display the text and enable 'space' key response
  var showText = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var trialClass = trialClasses[i];
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



  function getSkewedRandom(minVal, maxVal, skew) {
    var u = Math.random();
    var skewFactor = Math.abs(skew);
    var randomSkewed = Math.pow(u, 1 / skewFactor);
  
    if (skew > 0) {
      randomSkewed = 1 - randomSkewed;
    }
  
    var scaledRandom = minVal + (randomSkewed * (maxVal - minVal));
    var randomValue = Math.round(scaledRandom);
    randomValue = Math.max(minVal, Math.min(randomValue, maxVal));
  
    return randomValue;
  }



  var revealImage = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var trialClass = trialClasses[i];
      var imgFolder = "";
      var skewness, randomNumber, randomNumber2;
    
      const minNum = 1;  // minimum value 1
      const maxNum = 11; // maximum value 11
      const skewnessNum = 1.8;
  
      if (0 * eachClassTrialNumber <= trialClass && trialClass < 1 * eachClassTrialNumber) {
        imgFolder = "uniform";
        randomNumber = Math.floor(Math.random() * 11) + 1; // large card
        do {
          randomNumber2 = Math.floor(Math.random() * 11) + 1; // small card
        } while (randomNumber2 === randomNumber); // ensure they are different
  
        console.log("random number1:", randomNumber);
        console.log("random number2:", randomNumber2);
        
      } else if (1 * eachClassTrialNumber <= trialClass && trialClass < 2 * eachClassTrialNumber) {
        imgFolder = "low";
        
        randomNumber = getSkewedRandom(minNum, maxNum, skewnessNum); // positive skewness
        do {
          randomNumber2 = getSkewedRandom(minNum, maxNum, skewnessNum); // positive skewness
        } while (randomNumber2 === randomNumber); // ensure they are different
        console.log("random number1:", randomNumber);
        console.log("random number2:", randomNumber2);
  
      } else if (2 * eachClassTrialNumber <= trialClass && trialClass < 3 * eachClassTrialNumber) {
        imgFolder = "high";
        randomNumber = getSkewedRandom(minNum, maxNum, -skewnessNum); // negative skewness
        do {
          randomNumber2 = getSkewedRandom(minNum, maxNum, -skewnessNum); // negative skewness
        } while (randomNumber2 === randomNumber); // ensure they are different
        console.log("random number1:", randomNumber);
        console.log("random number2:", randomNumber2);
      }
  
      lastRandomNumber = randomNumber;
      lastRandomNumber2 = randomNumber2;
  
      // Set timeout to replace the back image with the front image after the flip animation
      setTimeout(function() {
        var revealedCard = document.getElementById('revealed-card');
        revealedCard.src = `img/${imgFolder}/${randomNumber}.jpg`;
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
  

  

  // Part 4: Show both images based on the decision or timeout
  var showBothImagesOrTimeout = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var trialClass = trialClasses[i];
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
        if ((lastRandomNumber < lastRandomNumber2 && lastDecision === 'arrowup') || 
            (lastRandomNumber > lastRandomNumber2 && lastDecision === 'arrowdown')) {
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
            <div class="message" style="color: ${messageColor}; font-size: 60px; font-weight: bold; position: absolute; top: 200px;">${message}</div>
            <img src="img/${imgFolder}/${lastRandomNumber}.jpg" class="large-image" id="revealed-card">
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
  
  // Part 5: Show reward feedback
  var showRewardFeedback = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var rewardChange = 0;
      var rewardChangeText = '';
      var rewardChangeColor = '';
      //console.log('showRewardFeedback lastTrialData:', { lastRandomNumber, lastRandomNumber2, lastDecision, lastTrialType }); // Log lastTrialData to verify contents

      if (lastTrialType === 'response') {
        if ((lastRandomNumber < lastRandomNumber2 && lastDecision === 'arrowup') || 
            (lastRandomNumber > lastRandomNumber2 && lastDecision === 'arrowdown')) {
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

}

jsPsych.run(timeline);
