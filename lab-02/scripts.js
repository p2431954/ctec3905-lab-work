
function greetMe() {
  console.log("Hello!!");
  myTrigger.textContent = "Thanks for clicking me";
}
myTrigger.addEventListener('click', greetMe);
