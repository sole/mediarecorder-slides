window.addEventListener('load', function() {
	var videoElement = document.querySelector('video');
	var surfaceElement = document.getElementById('surface');
	var progressBar = document.querySelector('progress');
	var finishButton = document.getElementById('finish');
	var recorder;
	var recordedTime = 0;
	var recordingStarted = false;
	var maxTime = 10;
	progressBar.max = maxTime;

	navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true
	}).then(function (stream) {
		
		surface.addEventListener('mousedown', resume);
		surface.addEventListener('mouseup', pause);

		finishButton.addEventListener('click', finish);

		playVideo(stream);

		recorder = new MediaRecorder(stream);
		recorder.addEventListener('dataavailable', function(e) {
			playVideo(e.data);
		});

	}).catch(function (err) {
		console.error(err);
	});

	function resume() {
		console.log('resume');
		if(!recordingStarted) {
			recorder.start();
			recordingStarted = true;
		} else {
			recorder.resume();
		}
	}

	function pause() {
		console.log('pause');
		recorder.pause();
	}

	function finish() {
		recorder.stop();
	}

	function playVideo(obj) {
		var url = URL.createObjectURL(obj);
		videoElement.src = url;
		videoElement.play();
	}
});
