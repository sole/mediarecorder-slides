window.onload = function() {
	navigator.mediaDevices.getUserMedia({
		video: {
			mediaSource: 'screen'
		}
	}).then(function (stream) {
		loopForever(recordClip, stream);
	}).catch(function(e) {
		console.log('ay', e);
	});

	function loopForever(fun, stream) {
		fun(stream).then(() => {
			setTimeout(() => {
				loopForever(fun, stream);
			}, 1000);
		});
	}

	function recordClip(stream) {
		return new Promise((ok, fail) => {

			var recorder = new MediaRecorder(stream);

			recorder.addEventListener('dataavailable', e => {
				var v = document.createElement('video');
				document.body.insertBefore(v, document.body.firstChild);

				while(document.body.children.length > 3) {
					document.body.removeChild(document.body.lastChild);
				}

				v.src = URL.createObjectURL(e.data);
				v.play();
				v.loop = true;
				ok();
			});
			
			recorder.start();

			setTimeout(() => {
				recorder.stop();
			}, 1000);

		});

	}

};
