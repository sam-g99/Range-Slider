const track = document.getElementById('track');
const progress = document.getElementById('progress');
const thumb = document.getElementById('thumb');

const event = new Event('slider');
function rangeSlider(track, thumb, progress) {
	this.percentage = 0;

	/* Thumb accounted for in track length */
	const trackLength = track.offsetHeight - thumb.offsetHeight;

	// const realTrackRange = trackLength - thumb.offsetHeight;

	// const thumbMiddle = thumb.offsetHeight / 2;

	// const thumbsCenterPosition =
	// debugger;

	const drag = (e) => {
		const scrollDistance =
			window.pageYOffset ||
			(
				document.documentElement ||
				document.body.parentNode ||
				document.body
			).scrollTop;

		const sliderDisFromTopOfPage =
			window.pageYOffset +
			track.getBoundingClientRect().top -
			scrollDistance;

		// Align the thumb more with the cursor
		const halfOfThumb = thumb.offsetHeight / 2;
		const percentagePositionToChange =
			-(e.clientY - sliderDisFromTopOfPage) + track.offsetHeight;

		const bottomDistance = (trackLength * percentagePositionToChange) / 100;
		console.log('changeeee', percentagePositionToChange, bottomDistance);

		let finalBottomDistance;
		let finalPercentage;

		// Make sure it doesn't go off track
		if (bottomDistance <= 0) {
			finalBottomDistance = 0;
			finalPercentage = 0;
		} else if (bottomDistance >= track.offsetHeight) {
			finalBottomDistance = trackLength;
			finalPercentage = 100;
		} else {
			if (bottomDistance > 0 && bottomDistance <= trackLength) {
				finalBottomDistance = bottomDistance;
			}
			const p = percentagePositionToChange;
			if (p <= 100 && p >= 0) {
				finalPercentage = percentagePositionToChange;
			} else {
				finalPercentage = 100;
			}
		}
		thumb.style.bottom = `${finalBottomDistance}px`;
		progress.style.height = `${finalPercentage}%`;

		this.percentage = finalPercentage;

		window.dispatchEvent(event);
	};

	thumb.addEventListener('mousedown', (e) => {
		document.onmousemove = drag;
	});

	document.addEventListener('mouseup', () => {
		document.onmousemove = null;
	});

	track.addEventListener('mousedown', (e) => {
		drag(e);
		document.onmousemove = drag;
	});
}

const rangeSlider1 = new rangeSlider(track, thumb, progress);

window.addEventListener('slider', (e) => {
	document.getElementById('percentage').textContent = rangeSlider1.percentage;
});
