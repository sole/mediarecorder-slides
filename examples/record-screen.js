window.onload = function() {
	navigator.mediaDevices.getUserMedia({
		video: {
			mediaSource: 'screen'
		}
	}).then(function (stream) {
		var video = document.createElement('video');
		video.src = URL.createObjectURL(stream);
		document.body.appendChild(video);
		video.play();

		var recorder = new MediaRecorder(stream);
		recorder.addEventListener('dataavailable', e => {
			video.src = URL.createObjectURL(e.data);
			video.play();
			video.loop = true;
		});
		setTimeout(() => {
			recorder.start();
		}, 500);

		setTimeout(() => {
			recorder.stop();
		}, 5000);

	}).catch(function(e) {
		console.log('ay', e);
	});
};
