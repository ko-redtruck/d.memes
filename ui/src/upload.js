//globals
var canvas = document.createElement("canvas");
canvas.id = "cc";
var ctx = canvas.getContext("2d");
var img_w;
var img_h;
var standard_img_w = 1100;
var HERMITE = new Hermite_class();



// EventListener------------------------

//Upload Meme (Post Meme)
document.addEventListener("DOMContentLoaded", function() {document.querySelector("#imageLoader").onchange = function (){
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
    // callback function
    $("#uploadSuccessfulModal").modal();
  })
}

//---------------------



// image upload + base64 encoder + commit post to DHT
function uploadMeme() {


  var imgObject = new Image();
  var element = document.querySelector("#imageLoader");
  var file = element.files[0];
  var reader = new FileReader();


  reader.onloadend = function() {
    document.querySelector("#submitButton").addEventListener("click", function(event){
      event.preventDefault();

      imgObject.onload =  function () {
        var on_finish = function (){
          request("appInfo","",function (appInfo) {
            const authorAppAgentHash = JSON.parse(appInfo)["Agent Hash"]
            var title = document.querySelector("#title").value;
            var tags = document.querySelector("#tags").value;
            var timestamp = new Date();
            var post = {
              "body": canvas.toDataURL(),
              "title": title,
              "tags": tags,
              "authorAppAgentHash": authorAppAgentHash,
              "timestamp": timestamp.toString()
            };
            createPost(JSON.stringify({"post":post}));
          })

        }
        draw_image(imgObject);
        var resizeFactor = standard_img_w / canvas.width
        HERMITE.resample(canvas,resizeFactor*canvas.width,resizeFactor*canvas.height,true, on_finish)

      }
      imgObject.src = reader.result;

    })
  }

  reader.readAsDataURL(file);
}

function draw_image(img){
	img_w = img.width;
	img_h = img.height;

	//prepare canvas
	canvas.width = img_w;
	canvas.height = img_h;
	ctx.clearRect(0, 0, img_w, img_h);

	//draw image
	ctx.drawImage(img, 0, 0);
}


//// TODO: Image Preview, Warning for missing title, tags, ... , message when upload successful
// TODO: move wrapper functions into new file
