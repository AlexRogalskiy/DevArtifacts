$(function() {
	// timing
	var waitFor = {
		// story sequence
		playClickDelay: 1 * 1000,
		toastFadeIn: 6 * 1000,
		musicCrescendoStart: 27.5 * 1000,
		musicCrescendoEnd: 39.3 * 1000,
		toastFlyAcrossSome: 46 * 1000,
		toastFlyAcrossSomeMore: 72 * 1000,

		// dialog
		dialogStartDelay: 2 * 1000,
		dialogContinueDelay: 0.25 * 1000,
		dialogCloseDelay: 5 * 1000
	};

	// dialog text
	var text1 = 'He did his best, but\n' +
				'the world was not\n' +
				'ready for toast.';
	var text2 = 'And so toast flew off\n' +
				'into the stars. He\n' +
				'never came back...';

	// cache jQuery wrappers
	var $body = $('body');
	var $getReady = $('.get-ready');
	var $splash = $('.splash');
	var $start = $('.start');
	var $toast = $('.toast');
	var $dialog = $('.dialog');
	var $theEnd = $('.the-end');
	var $audio = $('audio');

	// cache audio elements
	var music = document.getElementById('music');
	var play = document.getElementById('play');
	var typing = document.getElementById('typing');

	// other vars
	var preloadsRemaining;
	var isAudioEnabled;

	// this kicks everything off
	startPreloads();

	function startPreloads() {
		preloadsRemaining = 0;

		// audio is a hassle on mobile, disabling until future Will decides to revisit
		isAudioEnabled = !(/android|iphone|ipad|ipod/i).test(navigator.userAgent);
		if (isAudioEnabled) {
			$audio.each(addPreload);
		}

		// immediate check in case everything is cached or audio is disabled
		checkPreloadsRemaining();
	}

	function addPreload(index, audio) {
		if (audio.readyState !== 4) {
			preloadsRemaining++;
			audio.addEventListener('canplaythrough', decrementPreloadsRemaining, false);
		}
	}

	function decrementPreloadsRemaining() {
		preloadsRemaining--;
		checkPreloadsRemaining();
	}

	function checkPreloadsRemaining() {
		if (preloadsRemaining === 0) {
			showSplash();
		}
	}

	function playAudio(audio) {
		if (isAudioEnabled) {
			audio.play();
		}
	}

	function showSplash() {
		$getReady.hide();
		$splash.show();
		$start.prop('disabled', false);
		$start.on('click', start);
	}

	function start() {
		$start.prop('disabled', true);
		playAudio(play);

		setTimeout(playCutscene, waitFor.playClickDelay);
	}

	function playCutscene() {
		$splash.hide();
		$toast.show();
		playAudio(music);

		setTimeout(startDialog.bind(this, text1), waitFor.toastFadeIn);
		setTimeout(toastFlyUp, waitFor.musicCrescendoStart);
		setTimeout(toastFlyAcross, waitFor.musicCrescendoEnd);
		setTimeout(startDialog.bind(this, text2), waitFor.toastFlyAcrossSome);
		setTimeout(showTheEnd, waitFor.toastFlyAcrossSomeMore);
	}

	function toastFlyUp() {
		$body.addClass('fly-up');
	}

	function toastFlyAcross() {
		$body
			.removeClass('fly-up')
			.addClass('fly-across');
	}

	function startDialog(text) {
		$dialog.show();
		setTimeout(continueDialog.bind(this, text), waitFor.dialogStartDelay);
	}

	function continueDialog(text) {
		var char = text.charAt(0);
		$dialog.append(char);

		if (/\S/.test(char)) {
			playAudio(typing);
		}

		text = text.slice(1);
		if (text.length > 0) {
			setTimeout(continueDialog.bind(this, text), waitFor.dialogContinueDelay);
		} else {
			setTimeout(closeDialog, waitFor.dialogCloseDelay);
		}
	}

	function closeDialog() {
		$dialog
			.hide()
			.empty();
	}

	function showTheEnd() {
		$theEnd.show();
	}
});
