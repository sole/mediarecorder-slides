var recordButton, stopButton, recorder;
var canvas;
var randomPitchInterval = 500;

var ac = new AudioContext();
var limiter = ac.createDynamicsCompressor();
limiter.connect(ac.destination);
var bufferSourceNode;

window.onload = function () {
	recordButton = document.getElementById('record');
	stopButton = document.getElementById('stop');
	canvas = document.querySelector('canvas');

	navigator.mediaDevices.getUserMedia({
		audio: true
	})
	.then(function (stream) {

		recordButton.disabled = false;
		recordButton.addEventListener('click', startRecording);
		stopButton.addEventListener('click', stopRecording);
		recorder = new MediaRecorder(stream);
		recorder.addEventListener('dataavailable', onRecordingReady);
		recorder.addEventListener('start', onRecordingStarted);


		console.log('recorder is ready');

		
		setTimeout(() =>{
			recordSomething();
		}, 100);
		
		setInterval(changeToRandomPitch, randomPitchInterval);

	});
};

function onRecordingStarted() {
	console.log('recording started');
}

function startRecording() {
	console.log('start recording');
	recordButton.disabled = true;
	stopButton.disabled = false;
	
	stopSample();

	recorder.start();
}

function stopRecording() {
	console.log('stop recording');
	recordButton.disabled = false;
	stopButton.disabled = true;

	recorder.stop();
}


function recordSomething() {
	console.log('record something');
	startRecording();
	setTimeout(stopRecording, 100);
}


function onRecordingReady(e) {
	var blob = e.data;
	var fr = new FileReader();
	fr.onload = function() {
		var arrayBuffer = this.result;
		ac.decodeAudioData(arrayBuffer, function(decoded) {
			console.log('yay!', decoded.length);
			useSample(decoded);
		}, function(fail) {
			console.error('fail!', fail);
		});
	};
	fr.readAsArrayBuffer(blob);
}

function useSample(sample) {
	
	MaximiseSampleInPlace(sample);

	if(bufferSourceNode) {
		bufferSourceNode.stop();
		bufferSourceNode.disconnect();
	}

	bufferSourceNode = ac.createBufferSource();
	bufferSourceNode.loop = true;
	bufferSourceNode.buffer = sample;
	bufferSourceNode.connect(limiter);
	bufferSourceNode.start();

	var data = [];
	var channelData = sample.getChannelData(0);
	
	for(var i = 0; i < channelData.length; i++) {
		data.push(channelData[i]);
	}

	RenderWave(canvas, data);
	
}

function stopSample() {
	console.log('stop sample');
	if(bufferSourceNode) {
		bufferSourceNode.stop();
		bufferSourceNode.disconnect();
		bufferSourceNode = undefined;
	}
}

function changeToRandomPitch() {
	if(bufferSourceNode) {
		var newValue = 2.0 * Math.random();
		bufferSourceNode.playbackRate.linearRampToValueAtTime(newValue, ac.currentTime + randomPitchInterval * 0.00025);
	}
}
