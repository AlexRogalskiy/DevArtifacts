$(document).ready(function() {

	$('.step[data-step="0"]').fadeIn();

	var step = 0;

	$('[data-toggle="popover"]').popover({trigger: 'click hover'});

	$(document).on('exercise-step-change', function(evt, exerciseEvt) {
		$('.step[data-step="' + exerciseEvt.lastStep + '"]').fadeOut(function() {
			$('.step[data-step="' + step + '"]').fadeIn();
		});
	});

	window.exercise = {};
	
	window.exercise.stepNext = function() {
		if(!$('.step[data-step="' + (step+1) + '"]').length) return;
		$(document).trigger('exercise-step-change', { step: step, lastStep: step++ });
	};
	window.exercise.stepPrev = function() {
		if(step<1) return;
		$(document).trigger('exercise-step-change', { step: step, lastStep: step-- });
	};
	window.exercise.stepTo = function(to) {
		if(!$('.step[data-step="' + to + '"]').length) return;
		if(to<0) return;
		var lastStep = step;
		step = to;
		$(document).trigger('exercise-step-change', { step: step, lastStep: lastStep });
	};

	$('[data-action="step-next"]').on('click', function() {
		exercise.stepNext();
	});

	$('[data-action="step-prev"]').on('click', function() {
		exercise.stepPrev();
	});
});
