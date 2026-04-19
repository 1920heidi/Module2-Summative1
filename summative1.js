const readline = require('readline');

const inputOutput = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Entry question for everyone
const entryQuestions = [
  {
    id: '0-nationality',
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
      id: '1-city',
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

// Store user answers for conditional logic
let userAnswers = {};
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let startTime;

function getNextQuestions() {
  // Determine which questions to ask next based on the first question
  
  // If user is Kenyan
  if (userAnswers['0-nationality'] === "Yes") {
    return [...conditionalQuestions.kenyan_yes];
  } 
  // If user is not Kenyan
  else if (userAnswers['0-nationality'] === "No") {
    return [...conditionalQuestions.kenyan_no];
  }
  
  return [];
}

function askQuestion(questionQuiz) {
  console.log("\n" + questionQuiz.question);
  
  // Display all choices
 questionQuiz.choices.forEach(function(choice) {
  console.log(choice);
    });
  
  inputOutput.question('\nYour answer: ', function(input) {
    var userInput = input.trim().toLowerCase();
    var matchingChoice = null;
    
    // Find matching choice (case-insensitive to accomodate user input incase they don't write answer as is)
    matchingChoice = questionQuiz.choices.find(choice => 
      choice.toLowerCase() === userInput
    );
    
    if (matchingChoice) {
      // Get the index of the selected choice
      var selectedIndex = questionQuiz.choices.findIndex(choice => 
        choice === matchingChoice
      );
      
      userAnswers[questionQuiz.id] = matchingChoice;
      
      // Check if answer is correct (only if question has correct answers defined)
      if (questionQuiz.answer && questionQuiz.answer.length > 0) {
        totalQuestions++;
        
        var isCorrect = questionQuiz.answer.some(answerIndex => 
          answerIndex === selectedIndex
        );
        
        if (isCorrect) {
          score++;
          console.log("✅ Correct! You selected: " + matchingChoice);
        } else {
          var correctAnswers = questionQuiz.answer.map(answerIndex => 
            questionQuiz.choices[answerIndex]
          ).join(", ");
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
      askQuestion(questionQuiz);
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
    var nextQuestion = nextQuestions.find(question => 
      !userAnswers.hasOwnProperty(question.id)
    );
    
    if (nextQuestion) {
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
    if (percentage >= 60) {
      console.log('Excellent!');
    } else if (percentage >= 30) {
      console.log('Good try!');
    } else {
      console.log('Better luck next time!');
    }
  }
  
  console.log('\n📋 Your Profile:');
  
  // Display all user answers
  for (var key in userAnswers) {
    var value = userAnswers[key];
    var capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    console.log(capitalizedKey + ": " + value);
  }
  
  inputOutput.close();
}

// Record start time
startTime = Date.now();

askQuestion(entryQuestions[0]);