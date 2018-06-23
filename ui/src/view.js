// TODO:  images should load one after another and wait for all to load and then appear on the website
document.addEventListener("DOMContentLoaded", function () {
  //app info
  request("appInfo","",function (result) {
    console.log(JSON.parse(result));
  });
  var postSection = document.querySelector("#post-section");
  function getPosts() {
    var params = {"limit":10};
    request("getPosts",JSON.stringify(params),function(posts) {
      // do something with the returned post array
      // convert string to array object
      var postArray = JSON.parse(posts);
      // add the pictures to the website
      // TODO: add them to div and display them in an appropiate size
      postArray.forEach(function (post) {

        // create image and add src data
        var image = new Image();
        image.src = post.Entry.body;
        image.className = "img-fluid";
        image.classList.add("rounded");
        image.classList.add("mx-auto");
        image.classList.add("d-block");

        // create title
        var title = document.createElement("h2");
        title.innerHTML = post.Entry.title;

        // divs fot the content
        var divs = createDivs(postSection);

        // create upvote button
        var button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-success";
        button.id = "upvoteButton";
        button.innerHTML = "Upvote";
        button.dataset.postHash = post.Hash
        // TODO: instead of onclick add a EventListener for the button
        button.onclick = upvote;

        // create comment button
      //  <input onclick="location.href='upload.html'">
        var commentButton = document.createElement("input");
        commentButton.type = "button";
        commentButton.className = "btn btn-secondary";
        commentButton.id = "commentButton";
        commentButton.value = "Comment";
        commentButton.dataset.parentHash = post.Hash
        // TODO: instead of onclick add a EventListener for the button
        commentButton.onclick = passData;

        // create paragraph for showing the number of upvotes
        var upvoteCounter = document.createElement("p");
        upvoteCounter.id = post.Hash;
        // update the counter
        updateUpvoteCounter(post.Hash);

        // append newly created element
        divs["colTitle"].append(title)
        divs["colPicture"].append(image);
        divs["colFooter1"].append(button);
        divs["colFooter1"].append(commentButton)
        divs["colFooter2"].append(upvoteCounter);

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

function passData() {
  var parentHash = this.dataset.parentHash;
  window.location = "viewPost.html?" + parentHash;
}

function createDivs(postSection) {

  row1 = createRow();
  row1.className += " justify-content-center";
  postSection.append(row1);

  col1 = createCollumn();
  col1.className = "col-8";
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
