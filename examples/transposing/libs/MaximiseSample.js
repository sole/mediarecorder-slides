function MaximiseSample(sample) {
	var length = sample.length;
	var numChannels = sample.numberOfChannels;
	var sampleRate = sample.sampleRate;
	var oac = new OfflineAudioContext(numChannels, length, sampleRate);
	var outputBuffer = oac.createBuffer(numChannels, length, sampleRate);
	
	var maxValue = 0;

	for(var i = 0; i < numChannels; i++) {
		var data = sample.getChannelData(i);
		for(var j = 0; j < length; j++) {
			var value = Math.abs(data[j]);
			maxValue = Math.max(value, maxValue);
		}
	}

	var amp = 1.0 / maxValue;

	console.log('max', maxValue, amp);

	for(var i = 0; i < numChannels; i++) {
		var inData = sample.getChannelData(i);
		var outData = outputBuffer.getChannelData(i);
		for(var j = 0; j < length; j++) {
			var value = data[j];
			outData[j] = value * amp;
		}
	}


	return outputBuffer;
}
