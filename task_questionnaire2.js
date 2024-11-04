export function taskQuestionnaire2(jsPsych) { 
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

        // Map numeric responses to actual labels
        var responseLabels = [
          "Very True", 
          "Somewhat True", 
          "Somewhat False", 
          "Very False"
        ];

        

        // Create a new object with the mapped responses
        var answers = {};
        Object.keys(data.response).forEach(function(question, index) {
          answers[`Question_${index + 1}`] = responseLabels[data.response[question]];
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
        link.download = `questionnaire_responses_BISBAS_${dateTime}.csv`;
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);

        // Show thank you message and then resolve
        document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
          <h1 style="font-size: 24px; text-align: center;">Thank you for your participation!</h1>
        </div>
      `;
      
        
        // After showing the thank you message for a while, resolve the promise
        setTimeout(() => {
          window.location = "http://localhost:8080/";
          resolve(); 
        }, 3000); // 3-second delay before redirecting
      } 
    }); 

    var timeline = [];

    // Combining description with the questionnaire
    var questionnaire = {
      type: jsPsychSurveyLikert,
      preamble: `
        <div class="center">
          <div class="logo-title">
            <img src="img/logo.png" width="20%">
            <h1>Questionnaire</h1>
            <p>Each item of this questionnaire is a statement that you may either agree or disagree with.
             For each item, please indicate how much you agree or disagree with what it says. 
             Be sure to respond to all items and avoid leaving any blank. Choose only one response for each statement. Please be as accurate and honest as possible. 
             Treat each item individually, as if it were the only one, and don’t worry about being "consistent" in your responses.</p>
          </div>
        </div>
      `,
      button_label: 'Done', // Replacing "Continue" with "Done"
      questions: [
        {prompt: "1. A person's family is the most important thing in life.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "2. Even if something bad is about to happen to me, I rarely experience fear or nervousness.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "3. I go out of my way to get things I want.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "4. When I'm doing well at something I love to keep at it.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "5. I'm always willing to try something new if I think it will be fun.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "6. How I dress is important to me.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "7. When I get something I want, I feel excited and energized.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "8. Criticism or scolding hurts me quite a bit.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "9. When I want something I usually go all-out to get it.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "10. I will often do things for no other reason than that they might be fun.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "11. It's hard for me to find the time to do things such as get a haircut.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "12. If I see a chance to get something I want I move on it right away.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "13. I feel pretty worried or upset when I think or know somebody is angry at me.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "14. When I see an opportunity for something I like I get excited right away.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "15. I often act on the spur of the moment.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "16. If I think something unpleasant is going to happen I usually get pretty 'worked up.'", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "17. I often wonder why people act the way they do.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "18. When good things happen to me, it affects me strongly.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "19. I feel worried when I think I have done poorly at something important.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "20. I crave excitement and new sensations.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "21. When I go after something I use a 'no holds barred' approach.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "22. I have very few fears compared to my friends.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "23. It would excite me to win a contest.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},
{prompt: "24. I worry about making mistakes.", labels: ["Very True", "Somewhat True", "Somewhat False", "Very False"], required: true},

      ]
    };

    timeline.push(questionnaire);

    // Start the experiment
    jsPsych.run(timeline);
  });
}
