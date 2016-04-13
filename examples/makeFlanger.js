function makeFlanger(audioContext) {
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

