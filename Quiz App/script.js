// all the variables I'll need
const difficulty=document.getElementById('difficulty-container');
const easy=document.getElementById('easy');
const medium=document.getElementById('medium');
const hard=document.getElementById('hard');
const questionName=document.getElementById('question');
const count=document.getElementById('count');
const options=document.getElementById('options');
const timer=document.getElementById('timer');
const next=document.getElementById('next');
const scores=document.getElementById('scores');
const leaderboard=document.getElementById('leaderboard');
const timerValue=document.getElementById('timer-value');
let score=0;
let counter=0;
let timeTotal=120;
let quizData;
let questions;

//to generate questions from the Json files
async function getQuestions(level){
    try{
        const response = await fetch("json/"+level+".json");
        if(!response.ok){
            throw new Error("Network response was not ok: "+response.statusText);
        }
        quizData= await response.json();
    } 
    catch (error) {
      console.error("Error loading questions:", error);
    }
}
//to remove the timer and next button
function beforeQuiz(){
    timer.style.display = "none";
    next.style.display = "none";
}
beforeQuiz();

//Start the quiz
async function startQuiz(level){
    await getQuestions(level);
    questions=quizData;
    difficulty.style.display="none";
    questionName.style.display="block";
    document.getElementById('question-container').style.display='block';
    next.style.display='inline-block'
    loadQuesions();
    startTimer();
}
easy.addEventListener('click',()=>{
    startQuiz('easy');
});
medium.addEventListener('click',()=>{
    startQuiz('medium');
});
hard.addEventListener('click',()=>{
    startQuiz('hard');
});

//load questions to the container
function loadQuesions(){
    count.innerHTML = "Quesion " +counter+ " out of "+questions.length;    
    if(counter<questions.length){
    questionName.innerText=questions[counter].question;
    options.innerHTML='';
    questions[counter].options.forEach(option=>{
        const button= document.createElement('button');
        button.innerText=option;
        button.classList.add('option-button');
        button.addEventListener('click',()=>{
        const optionButtons = document.querySelectorAll(".option-button");
        optionButtons.forEach(button=>button.disabled=true);
            if(button.innerText===questions[counter].answer){
                score++;
                button.classList.add('correct');
                next.disabled=false;
            }
            else{
                button.classList.add('wrong');
                next.disabled=false;
            }
        });
        options.appendChild(button);
    });
}
    else{
        quizEnd();
    }
    next.disabled=true;
}

next.addEventListener('click',()=>{
    counter++;
    loadQuesions();
    next.disabled=true;
});

function quizEnd(){
    let resultsmessage;     
    if(score===questions.length){
        resultsmessage= `Congratulations! You scored ${score} out of ${questions.length}.`;
    }
    else{
        resultsmessage= `Sorry, You Lost. You scored ${score} out of ${questions.length}.`;
    }
    clearInterval(timeR);
    const optionButtons = document.querySelectorAll(".option-button");
    optionButtons.forEach(button=>button.disabled=true);
    scores.innerText=resultsmessage;
    leaderboard.style.display="block";
    leaderboard.innerText=`LeaderBoards: Score: ${score}`;
    next.style.display="none";
    count.style.display="none";
}

function startTimer(){
    timeLeft=timeTotal;
    timer.style.display="block";
    timer.innerText=`Time Left: ${timeLeft} seconds`;
    timeR=setInterval(function(){
        timeLeft--;
        timer.innerText=`Time Left: ${timeLeft} seconds`;
        if(timeLeft<=0){
            clearInterval(timeR);
            quizEnd();
        }
    },1000);
}
