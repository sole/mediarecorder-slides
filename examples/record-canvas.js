window.onload = function() {
	var button = document.querySelector('button');
  var video = document.querySelector('video');
  var canvas = document.querySelector('canvas');
  var width = canvas.width;
  var height = canvas.height;
  var capturing = false;

  video.width = width;
  video.height = height;

  // We need the 2D context to individually manipulate pixel data
  var ctx = canvas.getContext('2d');

  // Start with a black background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  
  // Since we're continuously accessing and overwriting the pixels
  // object, we'll request it once and reuse it across calls to draw()
  // for best performance (we don't need to create ImageData objects
  // on every frame)
  var pixels = ctx.getImageData(0, 0, width, height);
  var data = pixels.data;
  var numPixels = data.length;

  var stream = canvas.captureStream(30);
  var recorder = new MediaRecorder(stream);

  recorder.addEventListener('dataavailable', finishCapturing);
  
  button.onclick = function() {
	startCapturing();

  };

  function startCapturing() {
    capturing = true;
    draw();

	recorder.start();
    setTimeout(function() {
      recorder.stop();
    }, 2000);
  }


  function finishCapturing(e) {
    capturing = false;
    var videoData = [ e.data ];
    var blob = new Blob(videoData, { 'type': 'video/webm' });
    var videoURL = URL.createObjectURL(blob);
    video.src = videoURL;
    video.play();
  }


  function draw() {
    // We don't want to render again if we're not capturing
    if(capturing) {
      requestAnimationFrame(draw);
    }
    drawWhiteNoise();
  }


  function drawWhiteNoise() {
    var offset = 0;

    for(var i = 0; i < numPixels; i++) {
      var grey = Math.round(Math.random() * 255);
      
      // The data array has pixel values in RGBA order
      // (Red, Green, Blue and Alpha for transparency)
      // We will make R, G and B have the same value ('grey'),
      // then skip the Alpha value by increasing the offset,
      // as we're happy with the opaque value we set when painting
      // the background black at the beginning
      data[offset++] = grey;
      data[offset++] = grey;
      data[offset++] = grey;
      offset++; // skip the alpha component
    }

    // And tell the context to draw the updated pixels in the canvas
    ctx.putImageData(pixels, 0, 0);
  }


};

