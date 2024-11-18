// global_variables.js
export const NumberOfTrials = 135; // this should be 135
export const ClassNumber = 3;
export const eachClassTrialNumber = NumberOfTrials / ClassNumber;

export const deck_number1_uni = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9];
export const deck_number2_uni = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9];
export const deck_number1_low = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9];
export const deck_number2_low = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9];
export const deck_number1_high = [9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1];
export const deck_number2_high = [9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1];

export const InitialRewardAmount = 10;
export const RewardAmount = 0.50;

function getRandomNumber(minVal, maxVal) {
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  }

  
  function selectCards(deck1, deck2, selectedDeck1, selectedDeck2, playArray1, playArray2) {
    let temp_rand1_index, temp_rand2_index, randomNumber1, randomNumber2;

    // Select random cards until eachClassTrialNumber is reached
    for (let i = 0; i < eachClassTrialNumber; i++) {
        // Select large card from deck1
        do {
            temp_rand1_index = getRandomNumber(minNum, maxNum);
        } while (selectedDeck1[temp_rand1_index] === 1);
        randomNumber1 = deck1[temp_rand1_index];
        selectedDeck1[temp_rand1_index] = 1;
        playArray1.push(randomNumber1); // Add to play array

        // Select small card from deck2
        do {
            do {
                temp_rand2_index = getRandomNumber(minNum, maxNum);
            } while (selectedDeck2[temp_rand2_index] === 1);
            randomNumber2 = deck2[temp_rand2_index];
            if (randomNumber1 !== randomNumber2) {
                selectedDeck2[temp_rand2_index] = 1;
                playArray2.push(randomNumber2); // Add to play array
            }
        } while (randomNumber2 === randomNumber1);
    }
}

  const minNum = 0;
  const maxNum = 44;
  
  // Initialize play arrays
  export var deck_number1_uni_play = [];
  export var deck_number2_uni_play = [];
  export var deck_number1_low_play = [];
  export var deck_number2_low_play = [];
  export var deck_number1_high_play = [];
  export var deck_number2_high_play = [];
  
  // Arrays to track selected indices
  var deck_number1_uni_selected = Array(deck_number1_uni.length).fill(0);
  var deck_number2_uni_selected = Array(deck_number2_uni.length).fill(0);
  var deck_number1_low_selected = Array(deck_number1_low.length).fill(0);
  var deck_number2_low_selected = Array(deck_number2_low.length).fill(0);
  var deck_number1_high_selected = Array(deck_number1_high.length).fill(0);
  var deck_number2_high_selected = Array(deck_number2_high.length).fill(0);
  

  
  // Fill play arrays
  selectCards(deck_number1_uni, deck_number2_uni, deck_number1_uni_selected, deck_number2_uni_selected, deck_number1_uni_play, deck_number2_uni_play);
  selectCards(deck_number1_low, deck_number2_low, deck_number1_low_selected, deck_number2_low_selected, deck_number1_low_play, deck_number2_low_play);
  selectCards(deck_number1_high, deck_number2_high, deck_number1_high_selected, deck_number2_high_selected, deck_number1_high_play, deck_number2_high_play);
  
//   console.log(deck_number1_uni_play);
//   console.log(deck_number2_uni_play);
//   console.log(deck_number1_low_play);
//   console.log(deck_number2_low_play);
//   console.log(deck_number1_high_play);
//   console.log(deck_number2_high_play);