window.onload = function() {
	var sections = Array.from(document.querySelectorAll('section'));
	//var currentSectionFragments;
	//var currentFragment;

	document.addEventListener('keydown', function (e) {
    if (!(e.metaKey || e.shiftKey || e.ctrlKey || e.altKey)) {
      switch (e.which) {
         case 38: // UP
          hideOneFragment();
          e.preventDefault();
          break;
         case 40: // DOWN
          showOneFragment();
          e.preventDefault();
          break;
      }
    }
  });
	
	sections.forEach(s => {
		// data-background to section style background value
		var bg = s.dataset['background'];
		if(bg !== undefined) {
			s.style.backgroundImage = `url(${bg})`;
		}

		// enable iframes for currently visible
		var isVisible = s.classList.contains('active');
		var id = s.id;
		if(isVisible) {
			var sectionIndex = id - 1;
			enableIframesAtSection(sectionIndex);
			hideFragmentsAtSection(sectionIndex);
			//updateFragmentsList(sectionIndex);
		}
	});
	
	decky.onSlideChange = function(n) {
		disableAllIframes();
		var index = n - 1;
		enableIframesAtSection(index);
		hideFragmentsAtSection(index);
		//updateFragmentsList(index);
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
		var iframes = Array.from(section.querySelectorAll('iframe'));
		iframes.forEach(iframe => {
			var dataSrc = iframe.dataset.src;
			if(dataSrc) {
				iframe.src = dataSrc;
			}
		});
	}

	function getCurrentSection() {
		var section = document.querySelector('section.active');
		return section;
	}

	function getFragmentsAtSection(index) {
		var section = sections[index];
		var fragments = Array.from(section.querySelectorAll('.fragment'));
		return fragments;
	}

	function hideFragmentsAtSection(index) {
		var fragments = getFragmentsAtSection(index);
		fragments.forEach(hideFragment);
	}

	function hideFragment(f) {
		f.classList.remove('visible');
	}

	function showFragment(f) {
		f.classList.add('visible');
	}

	function hideOneFragment() {
		var currentSection = getCurrentSection();
		var visibleFragments = Array.from(currentSection.querySelectorAll('.fragment.visible'));
		var lastVisible = visibleFragments.pop();
		if(lastVisible) {
			hideFragment(lastVisible);
		}
	}

	function showOneFragment() {
		var currentSection = getCurrentSection();
		var index = currentSection.id;
		var fragments = getFragmentsAtSection(index - 1);
		var nextFragment;
		
		for(var i = 0; i < fragments.length; i++) {
			var f = fragments[i];
			if(!f.classList.contains('visible')) {
				nextFragment = f;
				break;
			}
		}
		
		if(nextFragment) {
			showFragment(nextFragment);
		}
	}
};
