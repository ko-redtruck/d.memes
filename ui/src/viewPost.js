// TODO:  images should load one after another and wait for all to load and then appear on the website
document.addEventListener("DOMContentLoaded", function () {
  var commentSection = document.querySelector("#comment-section");
  var postSection = document.querySelector("#post-section");

  function getPost() {
    request("readPost", window.location.search.substring(1), function(post) {
      if (post==="hash is not of type post"){
        return 0;
      }

      else{
        var post = JSON.parse(post);

        // create image and add src data
        var image = new Image();
        image.src = post.body;
        image.className = "img-fluid";
        image.classList.add("rounded");
        image.classList.add("mx-auto");
        image.classList.add("d-block");
        // create title
        var title = document.createElement("h2");
        title.innerHTML = post.title;
        // divs fot the content
        var divs = createDivs(postSection);

        // create upvote button
        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-success";
        button.id = "upvoteButton";
        button.innerHTML = "Upvote";
        button.dataset.postHash = window.location.search.substring(1)
        // TODO: instead of onclick add a EventListener for the button
        button.onclick = upvote;

        // create paragraph for showing the number of upvotes
        var upvoteCounter = document.createElement("p");
        upvoteCounter.id = window.location.search.substring(1);
        // update the counter
        updateUpvoteCounter(window.location.search.substring(1));

        // append newly created element
        divs["colTitle"].append(title)
        divs["colPicture"].append(image);
        divs["colFooter1"].append(button);
        divs["colFooter2"].append(upvoteCounter);
      }
      })
    }

  getPost();


  function getComments() {
    request("getAllComments",window.location.search.substring(1),function(comments) {

      // do something with the returned post array
      // convert string to array object
      if (comments==="0") {
        heading = document.createElement("h6");
        heading.innerHTML = "Be the first to comment!";
        commentSection.append(heading);
      }
      else {
        var comments = JSON.parse(comments)
        // add the pictures to the website
        comments.forEach(function (comment) {

          // Create Media Div Parent
          var mediaDiv = document.createElement("div");
          mediaDiv.className = "media"

          if (comment.Entry.parentHash != window.location.search.substring(1)) {
            //append the comment to its parent
            waitForElement("#"+"mediaBody_"+comment.Entry.parentHash, function(){
              console.log("appending to body")
              document.querySelector("#"+"mediaBody_"+comment.Entry.parentHash).appendChild(mediaDiv);
              updateUpvoteCounter(comment.Hash);

            });
          }
          else {
            console.log("appending to mediaDiv")
            commentSection.append(mediaDiv)
          }

          // create user avatar
          var avatar = new Image();
          avatar.src = "../img/blank-profile-picture.jpg";
          avatar.className = "mr-3"
          mediaDiv.append(avatar);

          // create media-body
          var mediaBody = document.createElement("div");
          mediaBody.className = "media-body";
          mediaBody.id = "mediaBody_"+ comment.Hash;
          mediaDiv.append(mediaBody);

          /*info section (username, upvote count + how old the comment is)*/
          var info = document.createElement("h5");
          info.className = "mt-0";

          //username
          request("getUsernameByAppAgentHash", comment.Entry.authorAppAgentHash, function (result) {
            const username = result + " ";
            info.innerHTML += username;

            // make the text small
            smallText = document.createElement("small");
            info.append(smallText);

            // create paragraph for showing the number of upvotes
            var upvoteCounter = document.createElement("span");
            upvoteCounter.id = comment.Hash;
            // update the counter
            if (comment.Entry.parentHash == window.location.search.substring(1)){
              updateUpvoteCounter(comment.Hash);
            }
            smallText.append(upvoteCounter);

            //comment age
            var currentTime = new Date();
            var timestamp = Date.parse(comment.Entry.timestamp);
            var timedif = (currentTime - timestamp)
            var commentAge = Math.round(timedif/60000)

            if (commentAge<=60){
              smallText.innerHTML += " · " + commentAge.toString() + " min ago"
            }

            if(commentAge>60){
              commentAge = Math.round(commentAge/60)
              smallText.innerHTML += " · "+commentAge.toString() + " h ago"
            }

            if(commentAge>1440){
              commentAge = Math.round(commentAge/1440)
              smallText.innerHTML += " · "+ commentAge.toString() + " days ago"
            }

            //append the info div
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
            commentLink.innerHTML = "Reply  ";
            actionRow.append(commentLink);

            //upvote Button
            var upvoteButton = document.createElement("i");
            upvoteButton.classList.add("fas", "fa-arrow-circle-up")
            upvoteButton.dataset.postHash = comment.Hash;
            upvoteButton.onclick = upvote;
            actionRow.append(upvoteButton);
          })
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

function waitForElement(elementPath, callBack){
  window.setTimeout(function(){
    if($(elementPath).length){
      callBack(elementPath, $(elementPath));
    }else{
      waitForElement(elementPath, callBack);
    }
  },500)
}

function passData() {
  var Hash = this.dataset.Hash;
  window.location = "viewPost.html?" + Hash;
}

function createDivs(postSection) {

  row1 = createRow();
  row1.className += " justify-content-center";
  postSection.append(row1);

  col1 = createCollumn();
  col1.className = "col-12";
  row1.append(col1);

  // title
  rowTitle = createRow();
  colTitle = createCollumn();
  col1.append(rowTitle)
  rowTitle.append(colTitle);

  // picture / meme
  rowPicture = createRow();
  colPicture = createCollumn();
  col1.append(rowPicture);
  rowPicture.append(colPicture);

  // footer (upvote button/ counter)
  rowFooter = createRow();
  colFooter1 = createCollumn();
  colFooter2 = createCollumn();
  col1.append(rowFooter);
  rowFooter.append(colFooter1);
  rowFooter.append(colFooter2);

  // return the collumns
  return {"colTitle":colTitle,"colPicture":colPicture,"colFooter1":colFooter1,"colFooter2":colFooter2}
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
