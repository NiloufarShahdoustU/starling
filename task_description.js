var timeline = [];

var title_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="center">
      <div class="logo-title">
        <img src="img/logo.png" width="20%">
        <h1>Starling Task</h1>
        <p>press <b>SPACE</b> to start</p>
      </div>
    </div>
  `,
  choices: [' '] // The key name for space is ' '
};
timeline.push(title_screen);

var confs = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="center">
      <p><img src="img/logo.png" width="20%"></p>
      <p><b>Welcome to this experiment and thank you very much for your participation.</b></p>
      <p>Do you confirm that you've been consented?</p>
      <p>press <b>Y</b> to confirm and continue</p>
      <p>press <b>N</b> to not confirm</p>
    </div>
  `,
  choices: ['y', 'n'],
  on_finish: function(data) {
    var response = data.response;
    if (response === 'n') {
      jsPsych.endExperiment('The experiment has been terminated because you did not consent.');
      setTimeout(() => {
        window.location.reload(); // Reloads the page after showing the message
      }, 3000); // Waits for 3 seconds before reloading
    }
  }
};

timeline.push(confs);




var task_description = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="center">
      <h2>Task description</h2>
      <img src="img/des.png" width="30%">
      <p>The aim of this game is to play the cards in <b>ascending order</b>. For example, play a three before an eight.</p>
      <p>Please decide whether you want to <b>PLAY (up arrow)</b> your card first or <b>HOLD (down arrow)</b> your card to play second.</p>
      <p>You win money for every card you play correctly, and lose money for every card you play incorrectly!</p>
    </div>
    <div class="center" style="margin-top: 20px;">
      <p style="font-size: 20px; text-align: center;">Press <b>SPACE</b> to start</p>
    </div>
  `,
  choices: [' ']
};




timeline.push(task_description);

// Export timeline if using modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = timeline;
}
