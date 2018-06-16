// TODO:  images should load one after another and wait for all to load and then appear on the website
document.addEventListener("DOMContentLoaded", function () {
  var postSection = document.querySelector("#post-section");
  function getPosts() {
    var params = {"limit":10};
    request("getPosts",JSON.stringify(params),function(posts) {
      // do something with the returned post array
      // convert string to array object
      var postArray = JSON.parse(JSON.parse(posts));
      // add the pictures to the website
      // TODO: add them to div and display them in an appropiate size
      postArray.forEach(function (post) {
        // create image and add src data
        var image = new Image();
        image.src = post.Entry.body
        // create colSlum for content
        var col = document.createElement("div");
        col.className = "col";
        // create upvote button
        var button = document.createElement("button");
        button.id = "upvoteButton";
        button.innerHTML = "Upvote Post";
        button.dataset.postHash = post.Hash
        // TODO: instead of onclick add a EventListener for the button
        button.onclick = upvote;
        // create paragraph for showing the number of upvotes
        var upvoteCounter = document.createElement("p");
        upvoteCounter.id = post.Hash;
        // update the counter
        updateUpvoteCounter(post.Hash);
        // append newly created elements
        postSection.append(col);
        col.append(image);
        col.append(button);
        col.append(upvoteCounter);

      })
    })
  }

  getPosts();
})

function upvote() {
  var postHash = this.dataset.postHash
  request("upvotePost",postHash,function (postHash) {
    //// NOTE: this posthash is not from above
    // update the upvote counter
    updateUpvoteCounter(postHash);

  })
}

function updateUpvoteCounter(postHash) {
  request("getUpvotes",postHash, function (result) {
    array = result.split(",");
    // array0 --> upvoteNumber array1 --> postHash
    upvoteCounter = document.querySelector("#"+array[1]);
    upvoteCounter.innerHTML = array[0];
  })
}
