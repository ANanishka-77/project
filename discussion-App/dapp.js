var submitQuestionNode=document.getElementById("submitBtn")
var questionTitleNode=document.getElementById("subject");
var questionDescriptionNode=document.getElementById("question")
var allQuestionListNode=document.getElementById("dataList");
var createQuestionFormNode=document.getElementById("toggleDisplay");
var questionDetailContainerNode=document.getElementById("respondQue");
var resolveQuestionContainerNode=document.getElementById("resolveHolder")
var resolveQuestionNode=document.getElementById("resolveQuestion");
var responseContainerNode=document.getElementById("responseAns");
var commentContainerNode=document.getElementById("commentHolder")
var commentatorNameNode=document.getElementById("pickName");
var commentNameNode=document.getElementById("pickComment")
var submitCommentNode=document.getElementById("commentBtn")
var questionSearchNode=document.getElementById("questionSearch");
var upvote=document.getElementById("upvote")
var downvote=document.getElementById("downvote")
var newQuestionFormButton = document.getElementById("newQuestionForm");
questionSearchNode.addEventListener("keyup",function(event)
{
   
    filterResult(event.target.value)
});

function filterResult(query)
{
  var allQuestions=getAllQuestions();
     clearQuestionPanel();  

  if(query)
  {
  var filteredQuestions=allQuestions.filter(function(question)
{
  if(question.title.includes(query)){
   return true;
  }
});
if(filteredQuestions.length)
{
  filteredQuestions.forEach(function(question)
  {
    addQuestionToPanel(question);
  })
}
else{
  printNoMatchFound()
}
  }
  else{
    allQuestions.forEach(function(question)
  {
    addQuestionToPanel(question);
  });
  }
 
}
function  clearQuestionPanel()
{
  allQuestionListNode.innerHTML=""
}
function onLoad()
{

  var allQuestions=getAllQuestions();
  allQuestions.sort(function(CurrentQ,nextQ)
{
   if(CurrentQ.isFav)
   {
     return -1;
   }
    return 1;
  })
  allQuestions.forEach(function(question)
{
  addQuestionToPanel(question)
})

}
onLoad();
newQuestionFormButton.addEventListener("click",openNewQuestionForm) 
submitQuestionNode.addEventListener("click",onQuestionSubmit)

function onQuestionSubmit()
{
   var question={
      title:questionTitleNode.value,
      description:questionDescriptionNode.value,
      responses:[],
      upvotes:0,
      downvotes:0,
      createdAt:Date.now(),
      isFav:false
   }
   saveQuestion(question);
   addQuestionToPanel(question);
   clearQuestionForm();
}
function saveQuestion(question)
{
    var allQuestions=getAllQuestions(); 
    allQuestions.push(question);
    localStorage.setItem("questions",JSON.stringify(allQuestions))
    
}
function getAllQuestions()
{
  var allQuestions=localStorage.getItem("questions")
  if(allQuestions)
   {
    allQuestions=JSON.parse(allQuestions)
   }
   else{
    allQuestions=[];
   }
   return allQuestions;
  }
function addQuestionToPanel(question)
{
  
   var questionContainer=document.createElement("div");
   questionContainer.setAttribute("id",question.title)
   questionContainer.style.background="#E7E7E7";
   questionContainer.style.margin = "10px";
   questionContainer.style.padding = "18px";
   questionContainer.style.cursor = "pointer";
   questionContainer.style.borderRadius="25px";

var creationDateandTimeNode=document.createElement("p")
creationDateandTimeNode.innerHTML=new Date(question.createdAt).toLocaleString();
creationDateandTimeNode.style.float="right";
creationDateandTimeNode.style.fontSize="15px";
questionContainer.appendChild(creationDateandTimeNode);


 var newQuestionTitleNode=document.createElement("p");
 newQuestionTitleNode.innerHTML=question.title;
 newQuestionTitleNode.style.fontSize="20px";
 newQuestionTitleNode.style.fontWeight="500"
questionContainer.appendChild(newQuestionTitleNode);

 var newQuestionDescriptionNode=document.createElement("p");
 newQuestionDescriptionNode.innerHTML=question.description;
 questionContainer.appendChild(newQuestionDescriptionNode);


 var downvoteTextNode=document.createElement("p")
downvoteTextNode.innerHTML="downvotes "+question.downvotes
downvoteTextNode.style.float="right";
questionContainer.appendChild(downvoteTextNode);

 var upvoteTextNode=document.createElement("p")
upvoteTextNode.innerHTML="upvote ="+question.upvotes
upvoteTextNode.style.float="right";
questionContainer.appendChild(upvoteTextNode)

var addToFavNode=document.createElement("button")
addToFavNode.id="favbtn";
addToFavNode.style.margin="10px";

 if(question.isFav)
    {
      addToFavNode.innerHTML="remove fav"
    }
    else
    {
     addToFavNode.innerHTML="add fav"
    }
questionContainer.appendChild(addToFavNode);
addToFavNode.addEventListener("click",toggleFavQuestion(question));
 allQuestionListNode.appendChild(questionContainer)

var createAtNode=document.createElement("p");
createAtNode.innerHTML="created: "+updateAndConvertTime(createAtNode)(question.createdAt)+" ago";
createAtNode.style.float="right"
createAtNode.style.fontSize="13px";
questionContainer.appendChild(createAtNode);



 questionContainer.addEventListener("click",onQuestionClick(question));
}
function toggleFavQuestion(question)
{
  return function(event)
  {
    event.stopPropagation();
    question.isFav=!question.isFav;
    updateQuestion(question);

    if(question.isFav)
    {
      event.target.innerHTML="remove fav"
    }
    else{
      event.target.innerHTML="add fav"
    }
  }
}
function onQuestionClick(question)
{
  return function()
  {

    selectedQuestion = question; 
    hideQuestionPanel();
    clearDetails();
    clearResponsePanel();
    showDetails();
    addQuestionToRight(question);
    question.responses.forEach(function(response)
  {
     addResponseInPanel(response)
  })
    submitCommentNode.onclick=onResponseSubmit(question);
    upvote.onclick=upvoteQuestion(question)
    downvote.onclick=downvoteQuestion(question)
  }
}

function upvoteQuestion(question)
{
   return function()
   {
     question.upvotes++
  updateQuestion(question)
  updateQuestionUI(question);
   }
}
function downvoteQuestion(question)
{
  return function()
  {
  question.downvotes++;
  updateQuestion(question)
  updateQuestionUI(question);
  }
}
function updateQuestionUI(question)
{
  var questionContainerNode=document.getElementById(question.title)
  questionContainerNode.childNodes[2].innerHTML="upvote = "+question.upvotes;
  questionContainerNode.childNodes[3].innerHTML="downvote = "+question.downvotes;
}
function onResponseSubmit(question)
{
 return function()
 {
  var response={
    name: commentatorNameNode.value,
    description: commentNameNode.value
  }
  saveResponse(question,response);
  question.responses.push(response);
  addResponseInPanel(response);

  commentatorNameNode.value="";
  commentNameNode.value="";
 }
}
function addResponseInPanel(response)
{
   var userNameNode=document.createElement("h4")
   userNameNode.innerHTML=response.name;

   var commentNode=document.createElement("p")
   commentNode.innerHTML=response.description;

   var container=document.createElement("div");

   container.appendChild(userNameNode);
   container.appendChild(commentNode);
   responseContainerNode.appendChild(container);
}

function showDetails()
{
  questionDetailContainerNode.style.display="block"
  resolveQuestionContainerNode.style.display="block"
  responseContainerNode.style.display="block"
  commentContainerNode.style.display="block"
}
function addQuestionToRight(question)
{
  questionDetailContainerNode.innerHTML="";
  var titleNode=document.createElement("h3");
  titleNode.innerHTML=question.title;

  var descriptionNode=document.createElement("p")
  descriptionNode.innerHTML=question.description;

  questionDetailContainerNode.appendChild(titleNode)
  questionDetailContainerNode.appendChild(descriptionNode)
}
function hideQuestionPanel()
{
  createQuestionFormNode.style.display="none";
}
function updateQuestion(updatedQuestion)
{
  var allQuestions=getAllQuestions();
   var reviseQuestions=allQuestions.map(function(question){
    if(updatedQuestion.title===question.title)
    {
      return updatedQuestion
    }
    return question;
  });
 localStorage.setItem("questions",JSON.stringify(reviseQuestions))
}
function saveResponse(updatedquestion,response)
{
  var allQuestions=getAllQuestions();
  var reviseQuestions=allQuestions.map(function(question){
    if(updatedquestion.title===question.title){
      question.responses.push(response)
    }
    return question;
  });
 localStorage.setItem("questions",JSON.stringify(reviseQuestions))

}
function clearDetails()
{
  questionDetailContainerNode.innerHTML="";
}
function clearResponsePanel()
{
  responseContainerNode.innerHTML=""
}
function printNoMatchFound()
{
  var title=document.createElement("h1")
  title.innerHTML="no match found"
  allQuestionListNode.appendChild(title)
}

var selectedQuestion=null;
resolveQuestionNode.addEventListener("click", function () {
  var allQuestions = getAllQuestions();

  var filtered = allQuestions.filter(function (q) {
    return q.title !== selectedQuestion.title;
  });

  localStorage.setItem("questions", JSON.stringify(filtered));

  location.reload();
});
function updateAndConvertTime(element)
{
 return function(time)
 {
  setInterval(function()
{
  element.innerHTML="created: "+convertDateToCreatedAtTime(time)+" ago";
},1000);
return convertDateToCreatedAtTime(time)
 }  

}


function convertDateToCreatedAtTime(date)
{
   var currentTime=Date.now();
  var timeLapsed=currentTime-new Date(date).getTime();

  var secondsDiff=parseInt(timeLapsed/1000);
  var minutesDiff=parseInt(secondsDiff/60);
  var hourDiff=parseInt(minutesDiff/60);
  return hourDiff+" hours "+minutesDiff+" minutes "+ secondsDiff+" Seconds ";
}
// Clear form
function clearQuestionForm() {
  questionTitleNode.value = "";
  questionDescriptionNode.value = "";
}

function hideQuestionDetails() {
    questionDetailContainerNode.style.display = "none";
    resolveQuestionContainerNode.style.display = "none";
    responseContainerNode.style.display = "none";
    commentContainerNode.style.display = "none";
}


function clearCommentPanel() {
    commentatorNameNode.value = "";
    commentNameNode.value = "";
}
function showQuestionForm() {
    createQuestionFormNode.style.display = "block";
}
function openNewQuestionForm()
{

   hideQuestionPanel();
clearCommentPanel();
hideQuestionDetails();
showQuestionForm();

    resolveQuestionContainerNode.style.display = "none";
}