window.addEventListener('load', function() {
  var videoElement = document.createElement('video'); // document.querySelector('video');
  var fragments = document.getElementById('fragments');

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(function (stream) {
    startRecording(stream);
  }).catch(function (err) {
    console.error(err);
  });

  function startRecording(stream) {

    videoElement.src = URL.createObjectURL(stream);
    videoElement.play();

    recordLoop(stream);

  }

  function recordLoop(stream) {

    recordClip(stream, function() {
      setTimeout(function() {
        recordLoop(stream);
      }, 1);
    });

  }

  function recordClip(stream, doneCallback) {
    var recorder = new MediaRecorder(stream,  {
      type: 'video/mp4'
    });
    recorder.start();
    setTimeout(function() {
      recorder.stop();
      recorder.ondataavailable = function (evt) {
        var videoURL = URL.createObjectURL(evt.data);
        addVideo(videoURL);
        doneCallback();
      };
    }, 1000);
  }

  function addVideo(src) {
	
	var videos = fragments.querySelectorAll('video');
	var first = fragments.firstChild;
	var last = fragments.lastChild;

    var el = document.createElement('video');
    el.controls = true;
	el.loop = true;
    el.src = src;

	fragments.insertBefore(el, first);

    if(videos.length > 20) {
		last.pause();
		fragments.removeChild(last);
    }

    // Important: wait until data is ready or else
    // the browser will complain about a broken format
    el.onloadeddata = function() {
      el.play();
    };
  }
});

// work around https://bugzilla.mozilla.org/show_bug.cgi?id=1260685
window.addEventListener('beforeunload', function() {
	console.log('this is ridiculous');
	var videos = Array.from(document.querySelectorAll('video'));
	videos.forEach(v => {
		v.pause();
	});
});
