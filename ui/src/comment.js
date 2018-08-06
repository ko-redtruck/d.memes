//globals


//Variables ----------------------------

// image uploader element


//Functions------------------------------

//Warpper functions
// upload string to the DHT
function createComment(comment) {
  request("createComment", comment, function(hash) {
    // callback function
    location.reload();
  })
}



//---------------------
document.addEventListener("DOMContentLoaded", function() {document.querySelector("#form").onsubmit = function (event){
  event.preventDefault();
  comment();
}})

function comment() {
  request("appInfo","",function (appInfo) {
    const authorAppAgentHash = JSON.parse(appInfo)["Agent Hash"]
    var title = "";
    var tags = "";
    var timestamp = new Date();
    var post = {
    "body": document.querySelector("#commentTextarea").value,
    "title": title,
    "tags": tags,
    "parentHash": window.location.search.substring(1),
    "authorAppAgentHash": authorAppAgentHash,
    "timestamp":  timestamp.toString()
    };

    createComment(JSON.stringify(post));
  })

}
