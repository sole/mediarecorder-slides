window.onload = function() {
	var audioContext = new AudioContext();

	navigator.mediaDevices.getUserMedia({
		audio: true
	}).then(function (stream) {
		connectToAudioContext(stream);
	});

	function connectToAudioContext(stream) {
		var now = audioContext.currentTime;
		var inputNode = audioContext.createMediaStreamSource(stream);
		var filter = makeFilter(audioContext);
		
		inputNode.connect(filter.input);
		filter.output.connect(audioContext.destination);

		// This is a temporary workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=934512
		// where the stream is collected too soon by the Garbage Collector
		window.doNotCollectThis = stream;

	}

	function makeFilter(audioContext) {
		var now = audioContext.currentTime;
		var inputGain = audioContext.createGain();
		var outputGain = audioContext.createGain();
		var dryGain = audioContext.createGain();
		dryGain.gain.setValueAtTime(0.4, now);
		var wetGain = audioContext.createGain();
		wetGain.gain.setValueAtTime(0.5, now);
		dryGain.connect(outputGain);
		wetGain.connect(outputGain);
		
		//
		// input -> ... -> output
		//
		  
		// initial value untouched
		inputGain.connect(dryGain);

		// delay with changing delay amount for flanger effect
		var maxDelayTime = 0.05; //0.02;
		var delay = audioContext.createDelay(maxDelayTime);
		inputGain.connect(delay);
		delay.connect(wetGain);

		var oscillator = audioContext.createOscillator();
		var oscGain = audioContext.createGain();
		oscillator.connect(oscGain);
		oscGain.gain.setValueAtTime(maxDelayTime * 0.25, now);

		oscGain.connect(delay.delayTime);
		oscillator.frequency.setValueAtTime(1 / 5.0, now);
		oscillator.start();

		return {
			input: inputGain,
			output: outputGain
		};
	}
};
