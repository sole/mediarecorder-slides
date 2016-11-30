window.onload = function() {
	
	var button = document.querySelector('button');
	button.onclick = demo;
	
	function demo() {

		var audioContext = new AudioContext();

		navigator.mediaDevices.getUserMedia({
			audio: true
		}).then(function (stream) {
			var recording = document.getElementById('recording');
			var outNode = connectToAudioContext(stream);

			// This is a temporary workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=934512
			// where the stream is collected too soon by the Garbage Collector
			window.doNotCollectThis = stream;

			var recorder = new MediaRecorder(outNode.stream);
			var audio = document.querySelector('audio');
			recorder.addEventListener('dataavailable', e => {
				audio.src = URL.createObjectURL(e.data);
				audio.play();
				audio.loop = true;
			});
			setTimeout(() => {
				recording.innerHTML = 'RECORDING';
				recorder.start();
			}, 500);

			setTimeout(() => {
				recording.innerHTML = 'done recording';
				recorder.stop();
			}, 5000);
		
		});

		function connectToAudioContext(stream) {
			var inputNode = audioContext.createMediaStreamSource(stream);
			var filter = makeEcho(audioContext);
			var streamOutput = audioContext.createMediaStreamDestination();
			inputNode.connect(filter.input);
			filter.output.connect(streamOutput);

			return streamOutput;
			
		}

	}
};

