export function taskDescription() { 
  var orderNumber = -1; 
  return new Promise((resolve, reject) => { 
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        // Call the download function after the experiment finishes
        downloadDemographicData(); 
        resolve(orderNumber); 
      } 
    }); 
    var timeline = []; 
 
    // Button choice for selecting the order 
    var button_choice = { 
      type: jsPsychHtmlButtonResponse,  // Use the button response plugin 
      stimulus: ` 
    <div class="center"> 
      <h2>Select Your Order</h2> 
    </div> 
  `, 
      choices: ['Order 1', 'Order 2'],  // Labels for the buttons 
      on_finish: function (data) { 
        // Save the chosen order in the orderNumber variable 
        var choice = data.response; 
        orderNumber = (choice === 0) ? 1 : 2; 
        console.log('Order chosen:', orderNumber); 
        jsPsych.data.addProperties({ orderNumber: orderNumber }); 
      } 
    }; 
    timeline.push(button_choice); 
 
    // Title screen 
    var title_screen = { 
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: ` 
    <div class="center"> 
      <div class="logo-title"> 
        <img src="img/logo.png" width="20%"> 
        <h1>Starling Task</h1> 
        <p>Press <b>SPACE</b> to start</p> 
      </div> 
    </div> 
  `, 
      choices: [' '] // The key name for the space bar is ' ' 
    }; 
    timeline.push(title_screen); 
 
    // Consent confirmation screen 
    var confs = { 
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: ` 
    <div class="center"> 
<p><img src="img/logo.png" width="20%"></p>
<h1 style="text-align: left;">Consent to participate in research</h1>
<h2 style="text-align: left;">Purpose:</h2>
<p>You are invited to participate in a research study aimed at understanding decision-making behavior. This study involves completing a brief online task.</p>

<h2 style="text-align: left;">Duration:</h2>
<p>Your participation will take approximately 30 minutes.</p>

<h2 style="text-align: left;">Procedures:</h2>
<p>You will complete an online task, which may involve decision-making exercises. In the next steps the task will be explained.</p>

<h2 style="text-align: left;">Risks and Benefits:</h2>
<p>There are no known risks beyond typical discomfort from screen usage. There are no direct benefits to you, but your participation will contribute to research on behavior.</p>

<h2 style="text-align: left;">Confidentiality:</h2>
<p>Your responses will be kept confidential and anonymous. No identifying information will be linked to your data.</p>

<h2 style="text-align: left;">Voluntary Participation:</h2>
<p>Your participation is voluntary, and you may withdraw at any time without penalty.</p>

<h2 style="text-align: left;">Contact Information:</h2>
<p>If you have any questions, please contact NeuroSmith lab.</p>
<p>Press <b>Y</b> if you agree with the terms above.</p>

    </div> 
  `, 
      choices: ['y'], 
    }; 
    timeline.push(confs); 


    /// Demographic Form with multiple questions
var demographic_form = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "What is your gender?",
      name: 'gender',
      options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
      required: true
    },
    {
      prompt: "What is your age range?",
      name: 'age',
      options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      required: true
    },
    {
      prompt: "What is your ethnicity?",
      name: 'ethnicity',
      options: ['Hispanic or Latino', 'Not Hispanic or Latino', 'Prefer not to say'],
      required: true
    },
    {
      prompt: "What is your race?",
      name: 'race',
      options: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Native Hawaiian or Other Pacific Islander', 'White', 'Prefer not to say'],
      required: true
    }
  ],
  preamble: `
<p><img src="img/logo.png" width="20%"></p>
  <p><b>Demographic form.</b></p>
`,
  data: { task: 'demographic' } // Add a data tag to identify this form
};

timeline.push(demographic_form);

 
    // Task description screen 
    var task_description = { 
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: ` 
    <div class="center"> 
      <h2>Task Description</h2> 
      <img src="img/des.png" width="30%"> 
      <p>The aim of this game is to play the cards in <b>ascending order</b>. For example, play a three before an eight.</p> 
      <p>Please decide whether you want to <b>PLAY (up arrow)</b> your card first or <b>HOLD (down arrow)</b> your card to play second.</p> 
      <p>You win money for every card you play correctly, and lose money for every card you play incorrectly!</p> 
    </div> 
    <div class="center" style="margin-top: 20px;"> 
      <p style="font-size: 20px; text-align: center;">Press <b>SPACE</b> to start</p> 
    </div> 
  `, 
      choices: [' '], // Waits for the participant to press SPACE to proceed 
    }; 
    timeline.push(task_description); 
    jsPsych.run(timeline); 


    
//////////////////////////////////////////FUNCTIONS/////////////////////////////////////////////////////////
// Function to automatically download demographic data
function downloadDemographicData() {
  // Filter the demographic form responses only using the 'task' data tag
  var demographic_data = jsPsych.data.get().filter({task: 'demographic'}).values();

  // Convert to CSV format
  var csv = 'Gender, Age, Ethnicity, Race\n';
  demographic_data.forEach(function(row) {
    csv += `${row.response.gender}, ${row.response.age}, ${row.response.ethnicity}, ${row.response.race}\n`;
  });

  // Get current date and time for file naming
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero
  var day = ("0" + date.getDate()).slice(-2); // Add leading zero
  var hours = ("0" + date.getHours()).slice(-2); // Add leading zero
  var minutes = ("0" + date.getMinutes()).slice(-2); // Add leading zero
  var seconds = ("0" + date.getSeconds()).slice(-2); // Add leading zero

  var dateTime = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;

  // Create a blob for CSV data
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  
  // Set the download attribute to the filename in 'date_time' format
  a.download = `demographic_data_${dateTime}.csv`;

  // Append anchor to body and trigger download
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

//////////////////////////////////////////FUNCTIONS/////////////////////////////////////////////////////////
 
  }) 
}
