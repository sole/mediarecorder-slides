window.onload = function() {
	var sections = Array.from(document.querySelectorAll('section'));
	
	sections.forEach(s => {
		// data-background to section style background value
		var bg = s.dataset['background'];
		if(bg !== undefined) {
			s.style.backgroundImage = `url(${bg})`;
		}

		// enable iframes for currently visible
		var isVisible = s.classList.contains('active');
		var id = s.id;
		console.log(isVisible, id);
		if(isVisible) {
			enableIframesAtSection(id - 1);
		}
	});
	
	decky.onSlideChange = function(n) {
		disableAllIframes();
		enableIframesAtSection(n - 1);
	};

	function disableAllIframes() {
		var iframes = Array.from(document.querySelectorAll('section iframe'));
		iframes.forEach(iframe => {
			var dataSrc = iframe.dataset.src;
			var src = iframe.src;
			iframe.removeAttribute('src');
			iframe.src = '';
		});
	}

	function enableIframesAtSection(sectionIndex) {
		var section = sections[sectionIndex];
		console.log(section, sectionIndex);
		var iframes = Array.from(section.querySelectorAll('iframe'));
		iframes.forEach(iframe => {
			var dataSrc = iframe.dataset.src;
			if(dataSrc) {
				iframe.src = dataSrc;
			}
		});
	}
};
