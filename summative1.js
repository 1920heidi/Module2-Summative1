const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Store user answers for conditional logic
let userAnswers = {};
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let startTime;

// Entry question for everyone
const entryQuestions = [
  {
    id: 'nationality',
    question: "Are you Kenyan?",
    choices: ["Yes", "No"]
  }
];

// Conditional questions based on answer given.
const conditionalQuestions = {
  // If user answered "Yes"
  kenyan_yes: [
    {
      id: '1-county',
      question: "Which of the following are cities in Kenya?",
      choices: ["Nairobi", "Mombasa", "Dandora", "Konza", "Naivasha"],
      answer: [0,1]
    },
    {
      id: '1-language',
      question: "What is the national language in Kenya?",
      choices: ["Swahili", "English", "Sheng"],
      answer: [0]
    },
    {
      id: '1-county',
      question: "Which city has a national park within?",
      choices: ["Nakuru", "Mombasa", "Kisumu", "Nairobi", "all of the above"],
      answer: [4]
    }
  ],
  // If user answered "No" 
  kenyan_no: [
    {
      id: '2-country',
      question: "What is Egypt known for?",
      choices: ["Pyramids", "Gold mines", "Slave trade", "World war 2"],
      answer: [0]
    },
    {
      id: '2-visit_reason',
      question: "Why do many tourists visit Kenya?",
      choices: ["Business", "Tourism", "Education", "Family"],
      answer: [1]
    },
    {
        id: '2-random_fact',
        question: "Random fact about Africa",
        choices: ["Africa has a horn", "Africa is one country", "Africa only has one race", "Africa is the largest continent"],
        answer: [0]
    }
  ],
};

function getNextQuestions() {
  // Determine which questions to ask next based on previous answers
  var questionsToAsk = [];
  
  // If user is Kenyan
  if (userAnswers.nationality === "Yes") {
    for (var i = 0; i < conditionalQuestions.kenyan_yes.length; i++) {
      questionsToAsk.push(conditionalQuestions.kenyan_yes[i]);
    }
  } 
  // If user is not Kenyan
  else if (userAnswers.nationality === "No") {
    for (var j = 0; j < conditionalQuestions.kenyan_no.length; j++) {
      questionsToAsk.push(conditionalQuestions.kenyan_no[j]);
    }
  }
  
  return questionsToAsk;
}

function askQuestion(questionObj) {
  console.log("\n" + questionObj.question);
  
  // Display all choices
  for (var i = 0; i < questionObj.choices.length; i++) {
    console.log(questionObj.choices[i]);
  }
  
  rl.question('\nYour answer: ', function(input) {
    var userInput = input.trim().toLowerCase();
    var matchingChoice = null;
    
    // Find matching choice (case-insensitive)
    for (var k = 0; k < questionObj.choices.length; k++) {
      if (questionObj.choices[k].toLowerCase() === userInput) {
        matchingChoice = questionObj.choices[k];
        break;
      }
    }
    
    if (matchingChoice !== null) {
      // Get the index of the selected choice
      var selectedIndex = -1;
      for (var m = 0; m < questionObj.choices.length; m++) {
        if (questionObj.choices[m] === matchingChoice) {
          selectedIndex = m;
          break;
        }
      }
      
      userAnswers[questionObj.id] = matchingChoice;
      
      // Check if answer is correct (only if question has correct answers defined)
      if (questionObj.answer && questionObj.answer.length > 0) {
        totalQuestions++;
        
        var isCorrect = false;
        for (var n = 0; n < questionObj.answer.length; n++) {
          if (questionObj.answer[n] === selectedIndex) {
            isCorrect = true;
            break;
          }
        }
        
        if (isCorrect === true) {
          score++;
          console.log("✅ Correct! You selected: " + matchingChoice);
        } else {
          var correctAnswers = "";
          for (var p = 0; p < questionObj.answer.length; p++) {
            if (p > 0) {
              correctAnswers = correctAnswers + ", ";
            }
            correctAnswers = correctAnswers + questionObj.choices[questionObj.answer[p]];
          }
          console.log("❌ Incorrect. You selected: " + matchingChoice);
          console.log("   Correct answer(s): " + correctAnswers);
        }
      } else {
        console.log("✅ You selected: " + matchingChoice);
      }
      
      // Continue with next question or finish
      continueQuiz();
    } else {
      console.log("❌ Invalid choice. Please type one of the available options.");
      askQuestion(questionObj);
    }
  });
}

function continueQuiz() {
  // Get the appropriate next questions based on current answers
  var nextQuestions = getNextQuestions();
  var remainingBaseQuestions = [];
  
  // Check if there are remaining base questions
  for (var i = currentQuestionIndex + 1; i < entryQuestions.length; i++) {
    remainingBaseQuestions.push(entryQuestions[i]);
  }
  
  // First finish any remaining base questions
  if (remainingBaseQuestions.length > 0) {
    currentQuestionIndex++;
    askQuestion(entryQuestions[currentQuestionIndex]);
  }
  // Then ask conditional questions
  else if (nextQuestions.length > 0) {
    // Find the next question we haven't asked yet
    var nextQuestion = null;
    for (var j = 0; j < nextQuestions.length; j++) {
      var questionId = nextQuestions[j].id;
      var alreadyAnswered = false;
      
      // Check if we already have this answer
      for (var key in userAnswers) {
        if (key === questionId) {
          alreadyAnswered = true;
          break;
        }
      }
      
      if (alreadyAnswered === false) {
        nextQuestion = nextQuestions[j];
        break;
      }
    }
    
    if (nextQuestion !== null) {
      askQuestion(nextQuestion);
    } else {
      finishQuiz();
    }
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const endTime = Date.now();
  const timeTaken = Math.round((endTime - startTime) / 1000); // Convert to seconds
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 QUIZ COMPLETE - Your Results:');
  console.log('='.repeat(50));
  
  // Display time taken
  var minutes = Math.floor(timeTaken / 60);
  var seconds = timeTaken % 60;
  var timeString = "";
  if (minutes > 0) {
    timeString = minutes + "m " + seconds + "s";
  } else {
    timeString = seconds + "s";
  }
  console.log("⏱️ Time Taken: " + timeString);
  
  // Display score
  if (totalQuestions > 0) {
    var percentage = Math.round((score / totalQuestions) * 100);
    console.log("\n🎯 Final Score: " + score + "/" + totalQuestions + " (" + percentage + "%)");
    
    // Performance feedback
    if (percentage >= 90) {
      console.log('🏆 Excellent! Outstanding performance!');
    } else if (percentage >= 70) {
      console.log('🎉 Great job! Well done!');
    } else if (percentage >= 50) {
      console.log('👍 Good effort! Keep practicing!');
    } else {
      console.log('💪 Don\'t give up! Study more and try again!');
    }
  }
  
  console.log('\n📋 Your Profile:');
  
  // Display all user answers
  for (var key in userAnswers) {
    var value = userAnswers[key];
    var capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    console.log(capitalizedKey + ": " + value);
  }
  
  // Provide personalized feedback based on their answers
  console.log('\n🎯 Personalized Message:');
  if (userAnswers.nationality === "Yes") {
    console.log("Welcome, fellow Kenyan! 🇰🇪");
    if (userAnswers.county) {
      console.log("Great to have someone from " + userAnswers.county + "!");
    }
  } else {
    console.log("Welcome to Kenya! 🌍");
    if (userAnswers.visit_reason) {
      console.log("Hope you enjoy your " + userAnswers.visit_reason.toLowerCase() + " here!");
    }
  }
  
  rl.close();
}

// Start the quiz
console.log('🎪 Welcome to the Adaptive Quiz!');
console.log('Your answers will determine which questions come next.\n');

// Record start time
startTime = Date.now();

askQuestion(entryQuestions[0]);