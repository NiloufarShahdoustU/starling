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
    console.log(trialNumberIterate_input);

    const fixation = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: "NO_KEYS",
      trial_duration: 500
    };

    timeline.push(fixation);

    for (var i = 0; i < trialNumberIterate_input.length; i++) {

      const trialClass = trialNumberIterate_input[i];
      var imgFolder = "";

      if (0 <= trialClass && trialClass < 45) {
        imgFolder = "uniform";
      } else if (45 <= trialClass && trialClass < 90) {
        imgFolder = "low";
      } else if (90 <= trialClass && trialClass < 135) {
        imgFolder = "high";
      }

      const showImages = {
        type: jsPsychHtmlKeyboardResponse,  // Use the string name of the plugin
        stimulus: `
        <div class="trial-container">
          <img src="img/${imgFolder}/back.jpg" class="large-image">
          <img src="img/${imgFolder}/back.jpg" class="small-image">
        </div>
      `,
        choices: "NO_KEYS",
        trial_duration: 1000
      };
      timeline.push(showImages);

      const showText = {
        type: jsPsychHtmlKeyboardResponse,  // Use the string name of the plugin
        stimulus: `
        <div class="trial-container">
          <img src="img/${imgFolder}/back.jpg" class="large-image">
          <img src="img/${imgFolder}/back.jpg" class="small-image">
          <div class="reveal-text">press <b>SPACE</b> to reveal your card</div>
        </div>
      `,
        choices: [' '],
        trial_duration: null
      };
      timeline.push(showText);

      const revealImage = {
        type: jsPsychHtmlKeyboardResponse,  // Use the string name of the plugin
        stimulus: function () {
          var randomNumber1, randomNumber2;
          const minNum = 0;
          const maxNum = 44;
          if (imgFolder === "uniform") {
            randomNumber1 = deck_number1_uni.splice(getRandomNumber(minNum, maxNum), 1)[0];
            do {
              randomNumber2 = deck_number2_uni.splice(getRandomNumber(minNum, maxNum), 1)[0];
            } while (randomNumber2 === randomNumber1);
          } else if (imgFolder === "low") {
            randomNumber1 = deck_number1_low.splice(getRandomNumber(minNum, maxNum), 1)[0];
            do {
              randomNumber2 = deck_number2_low.splice(getRandomNumber(minNum, maxNum), 1)[0];
            } while (randomNumber2 === randomNumber1);
          } else if (imgFolder === "high") {
            randomNumber1 = deck_number1_high.splice(getRandomNumber(minNum, maxNum), 1)[0];
            do {
              randomNumber2 = deck_number2_high.splice(getRandomNumber(minNum, maxNum), 1)[0];
            } while (randomNumber2 === randomNumber1);
          }
          lastRandomNumber1 = randomNumber1;
          lastRandomNumber2 = randomNumber2;

          setTimeout(function () {
            const revealedCard = document.getElementById('revealed-card');
            revealedCard.src = `img/${imgFolder}/${randomNumber1}.jpg`;
            revealedCard.classList.remove('flip');
            revealedCard.classList.add('flip-reveal');
          }, 250);

          return `
          <div class="trial-container">
            <img src="img/${imgFolder}/back.jpg" class="large-image flip" id="revealed-card">
            <img src="img/${imgFolder}/back.jpg" class="small-image" id="small-card">
            <div class="reveal-text">play (up arrow)<br>hold (down arrow)</div>
          </div>
        `;
        },
        choices: ['arrowup', 'arrowdown'],
        trial_duration: 3000,
        on_finish: function (data) {
          if (data.response === null) {
            lastTrialType = 'timeout';
          } else {
            lastDecision = data.response;
            lastTrialType = 'response';
          }
        }
      };
      timeline.push(revealImage);

      const showBothImagesOrTimeout = {
        type: jsPsychHtmlKeyboardResponse,  // Use the string name of the plugin
        stimulus: function () {
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
      timeline.push(showBothImagesOrTimeout);

      const showRewardFeedback = {
        type: jsPsychHtmlKeyboardResponse,  // Use the string name of the plugin
        stimulus: function () {
          var rewardChange = 0;
          var rewardChangeText = '';
          var rewardChangeColor = '';

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
      timeline.push(showRewardFeedback);
    }

    jsPsych.run(timeline);
    // jsPsych.on('finish', () => {
    //   resolve('Experiment completed');
    // });

  })

}

