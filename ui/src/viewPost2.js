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

          // Create the structure
          var divs = createDivs(commentSection);

          // create user avatar
          var avatar = new Image();
          avatar.src = "../img/blank-profile-picture.jpg"

          // create content paragraph
          var content = document.createElement("p");
          content.innerHTML = comment.Entry.body;

          /*info section (username, upvote count + how old the comment is)*/
          var infoParagraph = document.createElement("p");

            //username
            const username = "XYs";
            infoParagraph += username;

            // create paragraph for showing the number of upvotes
            var upvoteCounter = document.createElement("span");
            upvoteCounter.id = comment.Hash;
            infoParagraph += upvoteCounter;
            // update the counter
            updateUpvoteCounter(comment.Hash);

            //comment age
            var commentAge = " 2 Sec"
            infoParagraph += commentAge

          // create upvote button
          var button = document.createElement("button");
          button.type = "button";
          button.className = "btn btn-success";
          button.id = "upvoteButton";
          button.innerHTML = "Upvote";
          button.dataset.postHash = comment.Hash
          // TODO: instead of onclick add a EventListener for the button
          button.onclick = upvote;

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

          // append newly created element
          divs["colAvatar"].append(avatar);
          divs["rowContent"].append(content);
          divs["rowInfo"].append(infoParagraph);
          divs["rowAction"].append(button);
          divs["rowAction"].append(commentButton);

        })
      }
    })
  }

  getComments();
})

function createDivs(postSection) {

  /*
  DIV-STRUCTURE

  #comment-Entry
    #avatar
    #payload
      #info
      #content
      #action
  */

  // comment entry
  ParentRow = createRow();
  ParentRow.className += " justify-content-center";
  postSection.append(ParentRow);

  ParentCol = createCollumn();
  ParentCol.className = "col-8";
  ParentCol.id = "comment-entry"
  ParentRow.append(ParentCol);

  // avatar
  colAvatar = createCollumn();
  ParentCol.append(colAvatar)

  // "payload" (everything else than avatar)
  colPayload = createCollumn();
  ParentCol.append(colPayload);

  // info (username, upvotecounter, comment age)
  rowInfo = createRow();
  colPayload.append(rowInfo);

  // content
  rowContent = createRow();
  colPayload.append(rowContent);

  // action (Vote + comment buttons)
  rowAction = createRow();
  colPayload.append(rowAction);

  // return the collumns
  return {"colAvatar":colAvatar, "rowInfo": rowInfo, "rowContent": rowContent, "rowAction": rowAction}
}


function createRow(){
  row = document.createElement("div");
  row.className = "row"
  return row;
}

function createCollumn(){
  col = document.createElement("div");
  col.className = "col"
  return col;
}


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

function passData() {
  var Hash = this.dataset.Hash;
  window.location = "viewPost.html?" + Hash;
}
