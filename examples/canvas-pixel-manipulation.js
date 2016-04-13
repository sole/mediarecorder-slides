window.onload = function () {
	var cutOff = 128;
	var cutOffInput = document.getElementById('cutoff');
    cutOffInput.addEventListener('input', function(e) {
      cutOff = Math.round(cutOffInput.value);
    });

	
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

	function initCanvas(video) {
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
	}


	function applyFilter(context, width, height) {
		var imageData = context.getImageData(0, 0, width, height);
		var data = imageData.data;

		for (var i = 0; i < data.length; i+=4) {
			data[i] = data[i] >= cutOff ? 255 : 0; // red
			data[i + 1] = data[i + 1] >= cutOff ? 255 : 0; // green
			data[i + 2] = data[i + 2] >= cutOff ? 255 : 0; // blue
		}

		// render pixels back
		context.putImageData(imageData, 0, 0);
	}

};


