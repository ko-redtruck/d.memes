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

          // create paragraph (body)
          var content = document.createElement("p");
          content.innerHTML = comment.Entry.body;

          // divs fot the content
          var divs = createDivs(commentSection);

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

          // create paragraph for showing the number of upvotes
          var upvoteCounter = document.createElement("p");
          upvoteCounter.id = comment.Hash;
          // update the counter
          updateUpvoteCounter(comment.Hash);

          // append newly created element
          divs["colBody"].append(content);
          divs["colFooter1"].append(button);
          divs["colFooter1"].append(commentButton)
          divs["colFooter2"].append(upvoteCounter);

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
    upvoteCounter.innerHTML = array[0];
  })
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
  col1.className = "col-8";
  row1.append(col1);



  // comment / content
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
  return {"colBody":colPicture,"colFooter1":colFooter1,"colFooter2":colFooter2}
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
