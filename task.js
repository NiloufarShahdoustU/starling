// If using modules
var timeline;
if (typeof require !== 'undefined') {
  timeline = require('./task_description.js');
}

var jsPsych = initJsPsych({
  experiment_width: 1000,
  on_finish: function() {
    // we will get back to this link after when we're done.
    window.location = "file://155.100.91.44/d/Code/Nill/Starling%20Task/repo/starling/demo.html";
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

// Define the fixation trial
var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 500
};

// // Function to add light gray background
// var addLightGrayBg = {
//   type: jsPsychCallFunction,
//   func: function() {
//     document.body.classList.add('light-gray-bg');
//   }
// };

// // Function to remove light gray background
// var removeLightGrayBg = {
//   type: jsPsychCallFunction,
//   func: function() {
//     document.body.classList.remove('light-gray-bg');
//   }
// };

// Add the function to add the background color right after the task description
// timeline.push(addLightGrayBg);

// Iterate through each trial and add the blank page and fixation trial before the actual trial
for (let i = 0; i < trialNumber; i++) {

  // Add a blank page with a random duration between 750 and 1000 ms
  var blankPage = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: "NO_KEYS",
    trial_duration: function() {
      var duration = Math.floor(Math.random() * (1000 - 750 + 1)) + 750;
      // console.log('Blank page duration:', duration);
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
          <h2 class="trial-number">Trial ${i + 1}</h2>
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
          <h2 class="trial-number">Trial ${i + 1}</h2>
          <img src="img/${imgFolder}/back.jpg" class="large-image">
          <img src="img/${imgFolder}/back.jpg" class="small-image">
          <div class="reveal-text">press 'space' to reveal your card</div>
        </div>
      `;
    },
    choices: [' '], // The key name for space is ' '
    trial_duration: null // This makes the trial wait indefinitely until 'space' is pressed
  };

  timeline.push(showImages);
  timeline.push(showText);
}

// Add the function to remove the background color after all trials are done
// timeline.push(removeLightGrayBg);

jsPsych.run(timeline);
