// TODO:  images should load one after another and wait for all to load and then appear on the website
document.addEventListener("DOMContentLoaded", function () {
  var commentSection = document.querySelector("#comment-section");
  function getComments() {
    console.log(window.location.search.substring(1))
    request("getComments",window.location.search.substring(1),function(comments) {

      // do something with the returned post array
      // convert string to array object
      if (comments==="0") {
        heading = document.createElement("h6");
        heading.innerHTML = "Be the first to comment!";
        commentSection.append(heading);
      }
      else {
        console.log(comments)
        var comments = JSON.parse(comments)
        // add the pictures to the website
        comments.forEach(function (comment) {

          // Create Media Div Parent
          var mediaDiv = document.createElement("div");
          mediaDiv.className = "media"
          commentSection.append(mediaDiv);

          // create user avatar
          var avatar = new Image();
          avatar.src = "../img/blank-profile-picture.jpg";
          avatar.className = "mr-3"
          mediaDiv.append(avatar);

          // create media-body
          var mediaBody = document.createElement("div");
          mediaBody.className = "media-body";
          mediaDiv.append(mediaBody);

          /*info section (username, upvote count + how old the comment is)*/
          var info = document.createElement("h5");
          info.className = "mt-0";

            //username
            const username = "XY ";
            info.innerHTML += username;

            // make the text small
            smallText = document.createElement("small");
            info.append(smallText);

            // create paragraph for showing the number of upvotes
            var upvoteCounter = document.createElement("span");
            upvoteCounter.id = comment.Hash;
            // update the counter
            updateUpvoteCounter(comment.Hash);
            smallText.append(upvoteCounter);

            //comment age
            var commentAge = " · 2h"
            smallText.innerHTML += commentAge

          mediaBody.append(info)

          // add content
          mediaBody.append(comment.Entry.body);

          /* reply and vote buttons */
          // div container
          actionRow = document.createElement("div");
          mediaBody.append(actionRow);

          // comment link/ button
          commentLink = document.createElement("a");
          commentLink.dataset.Hash = comment.Hash;
          // TODO: instead of onclick add a EventListener for the button
          commentLink.onclick = passData;
          commentLink.innerHTML = "Reply";
          actionRow.append(commentLink);

          //upvote Button
          var upvoteButton = document.createElement("button");
          upvoteButton.type = "button";
          upvoteButton.className = "btn btn-default"
          upvoteButton.setAttribute('aria-label', 'Left Align')

          var upvoteSpan = document.createElement("span");
          upvoteSpan.className = "glyphicon glyphicon-chevron-up"
          upvoteButton.setAttribute('aria-hidden', 'true');

          upvoteButton.append(upvoteSpan);
          actionRow.append(upvoteButton);

          /*
          class = glyphicon glyphicon-chevron-up
          <button type="button" class="" aria-label="Left Align">
  <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
</button>

          //downvote Button
          class = glyphicon glyphicon-chevron-down
          <button type="button" class="btn btn-default" aria-label="Left Align">
  <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
</button>


          */

          /*
          // create upvote button
          var button = document.createElement("button");
          button.type = "button";
          button.className = "btn btn-success";
          button.id = "upvoteButton";
          button.innerHTML = "Upvote";
          button.dataset.postHash = comment.Hash
          // TODO: instead of onclick add a EventListener for the button
          button.onclick = upvote;
          mediaBody.append(button);

          // create comment button
          //  <input onclick="location.href='upload.html'">
          var commentButton = document.createElement("input");
          commentButton.type = "button";
          commentButton.className = "btn btn-secondary";
          commentButton.id = "commentButton";
          commentButton.value = "Comment";
          commentButton.dataset.Hash = comment.Hash;
          // TODO: instead of onclick add a EventListener for the button
          commentButton.onclick = passData;
          mediaBody.append(commentButton);
          */

        })
      }
    })
  }

  getComments();
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
    upvoteCounter.innerHTML = array[0] + " points";
  })
}

function passData() {
  var Hash = this.dataset.Hash;
  window.location = "viewPost.html?" + Hash;
}
