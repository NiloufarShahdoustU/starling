export function taskQuestionnaire(jsPsych) { 
  return new Promise((resolve) => { 
    jsPsych = initJsPsych({ 
      experiment_width: 1000, 
      on_finish: function () { 
        // Get current date and time for file naming
        var date = new Date();
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero
        var day = ("0" + date.getDate()).slice(-2); // Add leading zero
        var hours = ("0" + date.getHours()).slice(-2); // Add leading zero
        var minutes = ("0" + date.getMinutes()).slice(-2); // Add leading zero
        var seconds = ("0" + date.getSeconds()).slice(-2); // Add leading zero
        var dateTime = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;

        // Get the survey data
        var data = jsPsych.data.get().filter({trial_type: 'survey-likert'}).values()[0];



        

        // Create a new object with the mapped responses
        var answers = {};
        Object.keys(data.response).forEach(function(question, index) {
          answers[`Question_${index + 1}`] = data.response[question];
        });
        

        // Convert the processed answers to CSV format with headers
        var csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "question,answer\n"; // Add headers

        Object.keys(answers).forEach(function(question) {
          csvContent += `${question},${answers[question]}\n`;
        });

        // Trigger CSV file download
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.href = encodedUri;
        link.download = `questionnaire_responses_${dateTime}.csv`;
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);

        // Show thank you message and then resolve
        document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
          <h1 style="font-size: 24px; text-align: center;"> </h1>
        </div>
      `;
      
        
        // After showing the thank you message for a while, resolve the promise
        setTimeout(() => {
          // window.location = "https://www.neurosmiths.org/tasks.html";
          resolve(); 
        }, 500); // 500ms
      } 
    }); 

    var timeline = [];

    var questionnaire = {
      type: jsPsychSurveyLikert,
      preamble: `
      <div class="center">
        <div class="logo-title">
          <img src="img/logo.png" width="20%">
          <h1>Questionnaire 1</h1>
             <p>This questionnaire consists of 21 groups of statements. Please read each group of statements carefully, and then pick out the one statement in each group that best describes the way you have been feeling during the past two weeks, including today. Circle the number beside the statement you have picked. If several statements in the group seem to apply equally well, circle the highest number for that group. Be sure that you do not choose more than one statement for any group, including Item 16 (Changes in Sleeping Pattern) or Item 18 (Changes in Appetite).</p>

        </div>
      </div>`,
      style: `
      .jspsych-survey-likert-statement {
        display: block; /* stack labels vertically */
        margin-bottom: 15px; /* increase spacing between labels */
      }
      
      .jspsych-survey-likert-options {
        margin-top: 10px; /* space between the question and options */
      }
  
      .jspsych-survey-likert-option {
        margin-bottom: 10px; /* space between each option */
      }

      `,
      button_label: 'Done',
      questions: [
        {prompt: "1. Sadness", labels: ["I do not feel sad.", "I feel sad much of the time.", "I am sad all the time.", "I am so sad or unhappy that I can't stand it."], required: true},
        {prompt: "2. Pessimism", labels: ["I am not discouraged about my future.", "I feel more discouraged about my future than I used to be.", "I do not expect things to work out for me.", "I feel my future is hopeless and will only get worse."], required: true},
        {prompt: "3. Past Failure", labels: ["I do not feel like a failure.", "I have failed more than I should have.", "As I look back, I see a lot of failures.", "I feel I am a total failure as a person."], required: true},
        {prompt: "4. Loss of Pleasure", labels: ["I get as much pleasure as I ever did from the things I enjoy.", "I don't enjoy things as much as I used to.", "I get very little pleasure from the things I used to enjoy.", "I can't get any pleasure from the things I used to enjoy."], required: true},
        {prompt: "5. Guilty Feelings", labels: ["I don't feel particularly guilty.", "I feel guilty over many things I have done or should have done.", "I feel quite guilty most of the time.", "I feel guilty all of the time."], required: true},
        {prompt: "6. Punishment Feelings", labels: ["I don't feel I am being punished.", "I feel I may be punished.", "I expect to be punished.", "I feel I am being punished."], required: true},
        {prompt: "7. Self-Dislike", labels: ["I feel the same about myself as ever.", "I have lost confidence in myself.", "I am disappointed in myself.", "I dislike myself."], required: true},
        {prompt: "8. Self-Criticalness", labels: ["I don't criticize or blame myself more than usual.", "I am more critical of myself than I used to be.", "I criticize myself for all of my faults.", "I blame myself for everything bad that happens."], required: true},
        {prompt: "9. Suicidal Thoughts or Wishes", labels: ["I don't have any thoughts of killing myself.", "I have thoughts of killing myself, but I would not carry them out.", "I would like to kill myself.", "I would kill myself if I had the chance."], required: true},
        {prompt: "10. Crying", labels: ["I don't cry any more than I used to.", "I cry more than I used to.", "I cry over every little thing.", "I feel like crying, but I can't."], required: true},
        {prompt: "11. Agitation", labels: ["I am no more restless or wound up than usual.", "I feel more restless or wound up than usual.", "I am so restless or agitated that it's hard to stay still.", "I am so restless or agitated that I have to keep moving or doing something."], required: true},
        {prompt: "12. Loss of Interest", labels: ["I have not lost interest in other people or activities.", "I am less interested in other people or things than before.", "I have lost most of my interest in other people or things.", "It's hard to get interested in anything."], required: true},
        {prompt: "13. Indecisiveness", labels: ["I make decisions about as well as ever.", "I find it more difficult to make decisions than usual.", "I have much greater difficulty in making decisions than I used to.", "I have trouble making any decisions."], required: true},
        {prompt: "14. Worthlessness", labels: ["I do not feel I am worthless.", "I don't consider myself as worthwhile and useful as I used to.", "I feel more worthless as compared to others.", "I feel utterly worthless."], required: true},
        {prompt: "15. Loss of Energy", labels: ["I have as much energy as ever.", "I have less energy than I used to have.", "I don't have enough energy to do very much.", "I don't have enough energy to do anything."], required: true},
        {prompt: "16. Changes in Sleeping Pattern", labels: ["I have not experienced any change in my sleeping pattern.", "I sleep somewhat more than usual.", "I sleep somewhat less than usual.", "I sleep a lot more than usual.", "I sleep a lot less than usual.", "I sleep most of the day.", "I wake up 1-2 hours early and can't get back to sleep."], required: true},
        {prompt: "17. Irritability", labels: ["I am no more irritable than usual.", "I am more irritable than usual.", "I am much more irritable than usual.", "I am irritable all the time."], required: true},
        {prompt: "18. Changes in Appetite", labels: ["I have not experienced any change in my appetite.", "My appetite is somewhat less than usual.", "My appetite is somewhat greater than usual.", "My appetite is much less than before.", "My appetite is much greater than usual.", "I have no appetite at all.", "I crave food all the time."], required: true},
        {prompt: "19. Concentration Difficulty", labels: ["I can concentrate as well as ever.", "I can't concentrate as well as usual.", "It's hard to keep my mind on anything for very long.", "I find I can't concentrate on anything."], required: true},
        {prompt: "20. Tiredness or Fatigue", labels: ["I am no more tired or fatigued than usual.", "I get more tired or fatigued more easily than usual.", "I am too tired or fatigued to do a lot of the things I used to do.", "I am too tired or fatigued to do most of the things I used to do."], required: true},
        {prompt: "21. Loss of Interest in Sex", labels: ["I have not noticed any recent change in my interest in sex.", "I am less interested in sex than I used to be.", "I am much less interested in sex now.", "I have lost interest in sex completely."], required: true},
      ]
    };
    
    

    timeline.push(questionnaire);

    // Start the experiment
    jsPsych.run(timeline);
  });
}
