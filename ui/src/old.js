function previewFile() {
  console.log("uploading image");
  var selectedFile = document.querySelector("#imageLoader").files[0];
  var reader = new FileReader();
  var imageCanvas = document.querySelector("#imageCanvas");
  var ctx = imageCanvas.getContext("2d");

  reader.onload = function (e) {
      var image = new Image();
      image.onload = function() {
          ctx.drawImage(image,0,0);
      }
      image.src = e.target.result;
    }
  reader.readAsDataURL(selectedFile);
}

function converter() {
  console.log(convertImgToBase64("imageCanvas"))
  convertBase64ToImg(convertImgToBase64("imageCanvas"),"imageCanvas2")
}

function convertImgToBase64(canvas_id) {
  var canvas = document.querySelector("#"+canvas_id);
  var imagData = canvas.toDataURL();
  return imagData;
}

document.addEventListener("DOMContentLoaded", function() {document.querySelector("#imgconvert").onclick = converter});
