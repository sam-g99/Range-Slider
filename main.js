const track = document.getElementById('track');
const progress = document.getElementById('progress');
const thumb = document.getElementById('thumb');

function rangeSlider(track, thumb, progress) {
	this.percentage = 0;

	/* Thumb accounted for in track length */
	const trackLength = track.offsetHeight - thumb.offsetHeight;

	const drag = (e) => {
		const scrollDistance =
			window.pageYOffset ||
			(
				document.documentElement ||
				document.body.parentNode ||
				document.body
			).scrollTop;

		const sliderDisFromTopOfPage =
			window.pageYOffset + track.getBoundingClientRect().top;

		const thumbDisFromTrackBottom = trackLength - thumb.offsetTop;

		const percentagePositionToChange =
			-(e.clientY - sliderDisFromTopOfPage) +
			track.offsetHeight +
			scrollDistance;

		// Align the thumb more with the cursor
		const halfOfThumb = thumb.offsetHeight / 2;

		const bottomDistance =
			(track.offsetHeight * percentagePositionToChange) / 100 -
			halfOfThumb;

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
				finalPercentage = percentagePositionToChange;
			}
		}

		thumb.style.bottom = `${finalBottomDistance}px`;
		progress.style.height = `${finalPercentage}px`;

		this.percentage = finalPercentage;
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
