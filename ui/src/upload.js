// EventListener------------------------

//Upload Meme (Post Meme)
document.addEventListener("DOMContentLoaded", function() {document.querySelector("#imageLoader").onchange = function (){
    //var base64_img = encodeImageFileAsURL(document.querySelector("#imageLoader"));
    uploadMeme();
  }
});

//Variables ----------------------------

// image uploader element


//Functions------------------------------

//Warpper functions
// upload string to the DHT
function createPost(post) {
  request("createPost", post, function(hash) {
    //document.querySelector("#lasthash").innerHTML = hash;
    // callback function
  })
}

//---------------------


// draw base64_img into canvas
function convertBase64ToImg(base64_img, canvas_id) {
  var canvas = document.querySelector("#"+canvas_id);
  var ctx = canvas.getContext("2d")
  var myImage = new Image();
  myImage.src = base64_img;
  ctx.drawImage(myImage,0,0);
}


// image upload + base64 encoder + commit post to DHT
function uploadMeme() {
  var imgObject = new Image();
  var loadTimer;
  var element = document.querySelector("#imageLoader");
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    document.querySelector("#submitButton").addEventListener("click", function(event){
      event.preventDefault();
      var title = document.querySelector("#title").value;
      var tags = document.querySelector("#tags").value;
      var post = {
        "body": reader.result,
        "title": title,
        "tags": tags
      };
      createPost(JSON.stringify(post));
    })
    /*
    //wait for the picture upload
    imgObject.src = reader.result;
    imgObject.onload = onImgLoaded();
    function onImgLoaded() {
      if (loadTimer != null) clearTimeout(loadTimer);
      if (!imgObject.complete){
        loadTimer = setTimeout(function () {
          onImgLoaded();
        }, 3);

      }
      else {
        onPreloadComplete();
      }
    }
  */
  }

  reader.readAsDataURL(file);
}

function onPreloadComplete() {
  var newImg = getImageData(imgObject, 120, 150, 150, 80, 2);
  document.querySelector("#submitButton").addEventListener("click", function(event){
    event.preventDefault();
    var title = document.querySelector("#title").value;
    var tags = document.querySelector("#tags").value;
    var post = {
      "body": newImg.src,
      "title": title,
      "tags": tags
    };
    createPost(JSON.stringify(post));
  });
}
//// TODO: Image Preview, Warning for missing title, tags, ... , message when upload successful
// TODO: move wrapper functions into new file
