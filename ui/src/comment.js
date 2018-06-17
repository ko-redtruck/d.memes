//globals


//Variables ----------------------------

// image uploader element


//Functions------------------------------

//Warpper functions
// upload string to the DHT
function createComment(comment) {
  request("createComment", comment, function(hash) {
    //document.querySelector("#lasthash").innerHTML = hash;
    // callback function
  })
}

//---------------------
document.addEventListener("DOMContentLoaded", function() {document.querySelector("#form").onsubmit = function (event){
  event.preventDefault();
  comment();
}})

function comment() {
  var title = "";
  var tags = "";
  var post = {
  "body": document.querySelector("#commentTextarea").value,
  "title": title,
  "tags": tags,
  "parentHash": window.location.search.substring(1),
  };

  createComment(JSON.stringify(post));
}
