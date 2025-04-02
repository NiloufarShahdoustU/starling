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
      <h2>Select an order randomly.</h2> 
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
      type: jsPsychSurveyHtmlForm,
      preamble: `
        <p><img src="img/logo.png" width="20%"></p>
        <p><b>Demographic form.</b></p>
      `,
      html: `
        <div style="text-align: left; max-width: 600px; margin: auto;">
          <label for="gender">What is your gender?</label><br>
          <select name="gender" required>
            <option value="" disabled selected>Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select><br><br>
    
          <label for="age">What is your age range?</label><br>
          <select name="age" required>
            <option value="" disabled selected>Select...</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65+</option>
          </select><br><br>
    
          <label for="ethnicity">What is your ethnicity?</label><br>
          <select name="ethnicity" required>
            <option value="" disabled selected>Select...</option>
            <option value="Hispanic or Latino">Hispanic or Latino</option>
            <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select><br><br>
    
          <label for="race">What is your race?</label><br>
          <select name="race" required>
            <option value="" disabled selected>Select...</option>
            <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
            <option value="Asian">Asian</option>
            <option value="Black or African American">Black or African American</option>
            <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
            <option value="White">White</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select><br><br>
    
          <label for="education">How many years of education have you completed?</label><br>
          <input type="number" name="education" min="0" max="100" required><br><br>
        </div>
      `,
      data: { task: 'demographic' }
    };
    
    

timeline.push(demographic_form);

 
    // Task description screen 
    var task_description = { 
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: ` 
    <div class="center"> 
      <h2>Task Description</h2> 
      <img src="img/des.png" width="30%"> 
      <p>Hello! The task will take almost <b>30 minutes</b> to complete. Also there is a questionnaire at the end of the task which will take 10 minutes to complete.</p>
      <p>Your card is the card in the middle of the screen and your opponent's card is on top right of the screen.</p> 
      <p>The aim of this game is to guess if your card is higher or lower than your opponent's card.</p> 
      <p>Please decide whether <b>your card is higher (press the up arrow)</b> or <b>your card is lower (press the down arrow)</b>.</p> 
      <p>Please respond as fast as you can once you have made your decision.</p>
      <p>You win money for every card you guess correctly, and lose money for every card you guess incorrectly!</p> 
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
var csv = 'Gender, Age, Ethnicity, Race, Education\n';
demographic_data.forEach(function(row) {
  csv += `${row.response.gender}, ${row.response.age}, ${row.response.ethnicity}, ${row.response.race}, ${row.response.education}\n`;
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
