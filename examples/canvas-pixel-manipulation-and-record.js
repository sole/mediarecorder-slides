window.onload = function () {
  
	// get video stream from user's webcam
  navigator.mediaDevices.getUserMedia({
    video: true
  })
  .then(function (stream) {

	var video = document.createElement('video');
    video.src = URL.createObjectURL(stream);
    video.addEventListener('loadedmetadata', function () {
      initCanvas(video);
    });
    video.play();
  });
};

function initCanvas(video) {
  video.width = video.videoWidth / 2;
  video.height = video.videoHeight / 2;
  var width = video.videoWidth;
  var height = video.videoHeight;

  var canvas = document.querySelector('canvas');
  canvas.width = width;
  canvas.height = height;

  var ctx = canvas.getContext('2d');
  var draw = function () {
    requestAnimationFrame(draw);
    ctx.drawImage(video, 0, 0, width, height);
    applyFilter(ctx, width, height);
  };

  draw();

  var stream = canvas.captureStream(24);
  recorder = new MediaRecorder(stream);
  recorder.addEventListener('dataavailable', function (evt) {
	var outVideo = document.querySelector('video');
	outVideo.width = canvas.width / 2;
	outVideo.height = canvas.height / 2;
	outVideo.src = URL.createObjectURL(evt.data);
	outVideo.play();
  });

  setTimeout(() => {
	  recorder.stop();
  }, 3000);

  setTimeout(() => {
	recorder.start();
  }, 1000);

}

function applyFilter(ctx, width, height) {
  var imageData = ctx.getImageData(0, 0, width, height);
  var data = imageData.data; // data is an array of pixels in RGBA

  for (var i = 0; i < data.length; i+=4) {
    var average = (data[i] + data[i + 1]  + data[i + 2]) / 3;
    data[i] = average >= 128 ? 255 : 0; // red
    data[i + 1] = average >= 128 ? 255 : 0; // green
    data[i + 2] = average >= 128 ? 255 : 0; // blue
  }

  ctx.putImageData(imageData, 0, 0);
}

