var timeline = [];

var title_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div class="center">
      <div class="logo-title">
        <img src="img/logo.png" width="20%">
        <h1>Starling Task</h1>
      </div>
    </div>
  `,
  choices: ['Start']
};
timeline.push(title_screen);

var confs = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "Do you confirm that you've been consented?",
      name: 'DesktopConf',
      options: ['1: I confirm', '2: I do not confirm'],
      required: true
    }
  ],
  preamble: `
    <p><img src="img/logo.png" width="20%"></p>
    <p><b>Welcome to this experiment and thank you very much for your participation.</b></p>
  `,
  on_finish: function(data) {
    var responses = data.response;
    if (responses.DesktopConf === '2: I do not confirm') {
      jsPsych.endExperiment('The experiment has been terminated because you did not consent.');
      setTimeout(() => {
        window.location.reload(); // Reloads the page after showing the message
      }, 3000); // Waits for 3 seconds before reloading
    }
  }
};

timeline.push(confs);

var task_description = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div class="center">
      <h2>Task description</h2>
      <img src="img/des.png" width="30%">
      <p>The aim of this game is to play the cards in <b>ascending order</b>. For example, play a three before an eight.</p>
      <p>Please decide whether you want to <b>PLAY (up arrow)</b> your card first or <b>HOLD (down arrow)</b> your card to play second.</p>
      <p>You win money for every card you play correctly, and lose money for every card you play incorrectly!</p>
    </div>
  `,
  choices: ['Next']
};

timeline.push(task_description);

// Export timeline if using modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = timeline;
}
