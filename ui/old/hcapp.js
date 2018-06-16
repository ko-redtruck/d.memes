function hello() {
  //alert("Hello");
  document.querySelector("p").innerHTML = "New Text";
}

// EventListener --> führt bei "onclick" eine bestimmte function aus
// DOMContentLoaded --> wird erst ausgeführt sobald die Website geladen ist
document.addEventListener("DOMContentLoaded", function() {document.querySelector("#plusButton").onclick = countPlus});
document.addEventListener("DOMContentLoaded", function() {document.querySelector("#minusButton").onclick = countMinus});

//EventListener für eine Form
document.addEventListener("DOMContentLoaded", function() { document.querySelector("#form").onsubmit = function() {
  const name = document.querySelector("#name").value;
  alert(`Hello ${name}!`)
}})

function holoTextRead(hash) {
  
}

// var: global Variable
// let: private Variable (existiert nur in den eigenen {})
// const: konstante Variable (kann nicht geändert werden)

var counter = 0;

function countPlus() {
  counter ++;
  document.querySelector("#counter").innerHTML = counter;
  checkIfCounterGerade(counter);
}

function countMinus() {
  counter --;
  document.querySelector("#counter").innerHTML = counter;
  checkIfCounterGerade(counter);
}

function checkIfCounterGerade(counter) {
  if (counter % 2 === 0) {
    // ` muss benutzt werden anstatt " " oder '' --> nur so können Variablen eingfügt werden
    //alert(`${counter} ist gerade!`);
  }
}
