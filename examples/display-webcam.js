navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true
}).then(function (stream) {
	var video = document.createElement('video');
	video.src = URL.createObjectURL(stream);
	document.body.appendChild(video);
	video.play();
});
