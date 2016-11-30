window.onload = function() {

	var button = document.querySelector('button');
	button.onclick = demo;

	function demo() {

		var audioContext = new AudioContext();

		navigator.mediaDevices.getUserMedia({
			audio: true
		}).then(function (stream) {
			connectToAudioContext(stream);
		});

		function connectToAudioContext(stream) {
			var inputNode = audioContext.createMediaStreamSource(stream);
			var effect = makeEcho(audioContext);
			
			inputNode.connect(effect.input);
			effect.output.connect(audioContext.destination);

			// This is a temporary workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=934512
			// where the stream is collected too soon by the Garbage Collector
			window.doNotCollectThis = stream;

		}

	}
};
