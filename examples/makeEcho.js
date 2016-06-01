function makeEcho(audioContext) {
	var now = audioContext.currentTime;
	var inputGain = audioContext.createGain();
	var outputGain = audioContext.createGain();
	
    var delay = audioContext.createDelay();
    var mixed = audioContext.createGain();
    var wetGain = audioContext.createGain();

    inputGain.connect(mixed);
    mixed.connect(outputGain);

    delay.connect(mixed);
    delay.delayTime.setValueAtTime(0.5, now);

    mixed.connect(wetGain);
    wetGain.connect(delay);
    wetGain.gain.setValueAtTime(0.9, now);
	
	return {
		input: inputGain,
		output: outputGain
	};

}
