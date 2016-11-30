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

function toActual(value, dpi) {
	return (Math.floor(value / 2)) + 'px';
}

function initCanvas(video) {
	var outVideo = document.querySelector('video');
  var dpi = window.devicePixelRatio || 1;
  var videoWidth = video.videoWidth;
  var videoHeight = video.videoHeight;
  var availableWidth = window.innerWidth;
  var half = availableWidth * 0.5;
  var scale = half / videoWidth;

  var finalWidth = Math.floor(half);
  var finalHeight = Math.floor(videoHeight * scale);

  var canvas = document.querySelector('canvas');
  canvas.width = finalWidth;
  canvas.height = finalHeight;
  var style = 'width: ' + toActual(finalWidth, dpi) + '; height: ' + toActual(finalHeight, dpi) + ';';
  canvas.style = style;

  video.width = finalWidth;
  video.height = finalHeight;
  outVideo.style = style;

  var ctx = canvas.getContext('2d');
  var draw = function () {
    requestAnimationFrame(draw);
	ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, finalWidth, finalHeight);
    applyFilter(ctx, finalWidth, finalHeight);
  };

  draw();

  var stream = canvas.captureStream(24);
  recorder = new MediaRecorder(stream);
  recorder.addEventListener('dataavailable', function (evt) {
	var outVideo = document.querySelector('video');
	outVideo.src = URL.createObjectURL(evt.data);
	outVideo.play();
  });

	var button = document.querySelector('button');
	button.onclick = demo;

	function demo() {

		setTimeout(() => {
			recorder.stop();
		}, 3000);

		recorder.start();

	}
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

