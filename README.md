# CLI Quiz Application

This quiz is a command-line interactive quiz that provides different question sets based on user nationality, focusing on Kenyan and African knowledge.

## Description

This CLI quiz application creates a personalized quiz experience by first determining if the user is Kenyan, then presenting relevant questions based on their response. The app tracks scoring, measures completion time, and provides performance feedback.

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. No additional dependencies needed - uses Node.js. Run the quiz with node summative.js

The application will:
1. Ask if you're Kenyan (Yes/No)
2. Present appropriate question sets based on your answer
3. Track your responses and calculate your score
4. Display final results with timing and performance feedback


### Application Features

**Interactive command-line interface**
  Implementation: Uses `createInterface()` to handle user input/output. 
    `const inputOutput = readline.createInterface{}`
  
  Code location*: `inputOutput.question()` method for prompting users and capturing responses.
    `inputOutput.question('\nYour answer: ', function(input)`

**Conditional question branching** 
  Implementation: `getNextQuestions()` function checks user's nationality answer and returns appropriate question arrays.
    `var nextQuestions = getNextQuestions();`

  Conditional logic: using `userAnswers['0-nationality']` to select `kenyan_yes` or `kenyan_no` question sets.
    `if (userAnswers['0-nationality'] === "Yes") {}` AND `if (userAnswers['0-nationality'] === "No") {}`

**Case-insensitive answer matching**
  User input is converted to lowercase with `input.trim().toLowerCase()` and matched using `choice.toLowerCase()`
  Code location: `askQuestion()` function uses `.find()` method to locate matching choices regardless of case.
    `matchingChoice = questionQuiz.choices.find(choice => choice.toLowerCase() === userInput);`

**Real-time scoring system**
  Implementation: Global `score` and `totalQuestions` variables track performance, updated immediately after each answer
    ` if (questionQuiz.answer && questionQuiz.answer.length > 0) { totalQuestions++;`
  
  Score incremented with `score++` when `isCorrect` condition is met using `questionQuiz.answer.some()` method
     `if (isCorrect) { score++; console.log("Correct! You selected: " + matchingChoice); ..}`

**Timer functionality**
  Records `startTime = Date.now()` at application start, calculates elapsed time in `finishQuiz()`

**Performance feedback (Excellent/Good try/Better luck next time)**
  Percentage calculation `(score / totalQuestions) * 100` with conditional thresholds (≥60%, ≥30%)
  
  `finishQuiz()` function contains if-else statements that display different messages based on score percentage.

**User profile summary**
  `userAnswers` object stores all responses, displayed using `for...in` loop with key capitalization
  
  Profile section iterates through stored answers and formats output with `capitalizedKey.charAt(0).toUpperCase()`

**Input validation with retry prompts**
  Validates user input against available choices, recursively calls `askQuestion(questionQuiz)` on invalid input
  
  Uses conditional check for `matchingChoice` - if null, displays error message and retries same question

## Array Iteration Methods Used

1. `.forEach()` - goes through/ iterates each question to display Choices

2. `.find()` - Search Operations find matching inputs

3. `.findIndex()` - Get Array Position/ index of the matched choice.

4. `.map()` - Data Transformation by converting answer indices to their corresponding text choices.

5. Spread Operator `...` - Creates a copy of question arrays based off how you answered the conditional questions.

## Example Output
Are you Kenyan? (this is a conditional question) 
Yes
No

Your answer: yes

Which of the following are cities in Kenya?
Nairobi
Mombasa
Dandora
Konza
Naivasha

Your answer: nairobi
Correct! You selected: Nairobi

[Quiz continues...]

QUIZ COMPLETE - Your Results:

Time Taken: 1m 23s

Final Score: 2/3 (67%)
Excellent!

Your Profile:
0-nationality: Yes
1-county: Nairobi
1-language: Swahili
1-city: Nairobi
