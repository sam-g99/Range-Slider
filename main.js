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

		// Cursors pixel position on track
		let clientPosY;

		if (e.clientY !== undefined) {
			clientPosY = e.clientY;
		} else {
			clientPosY = e.touches[0].clientY;
		}

		const cursorPosition =
			-(clientPosY - sliderDisFromTopOfPage) +
			track.offsetHeight -
			thumb.offsetHeight / 2;

		let thumbPosition =
			-(thumb.getBoundingClientRect().top - sliderDisFromTopOfPage) +
			track.offsetHeight;

		let percentagePositionToChange =
			((thumbPosition - thumb.offsetHeight) * 100) /
			(track.offsetHeight - thumb.offsetHeight);

		const bottomDistance = cursorPosition;

		let finalBottomDistance;
		let finalPercentage;

		// Make sure it doesn't go off track
		if (bottomDistance <= 0) {
			finalBottomDistance = 0;
			finalPercentage = 0;
		} else if (bottomDistance >= track.offsetHeight - thumb.offsetHeight) {
			finalBottomDistance = trackLength;
			finalPercentage = 100;
		} else {
			if (bottomDistance > 0 && bottomDistance <= trackLength) {
				finalBottomDistance = bottomDistance;
			} else {
				finalBottomDistance = 100;
			}
			const p = percentagePositionToChange;
			if (p <= 100 && p >= 0) {
				finalPercentage = percentagePositionToChange;
			} else {
				finalPercentage = 100;
			}
		}
		thumb.style.bottom = `${finalBottomDistance}px`;

		thumbPosition =
			-(thumb.getBoundingClientRect().top - sliderDisFromTopOfPage) +
			track.offsetHeight;

		percentagePositionToChange =
			((thumbPosition - thumb.offsetHeight) * 100) /
			(track.offsetHeight - thumb.offsetHeight);

		progress.style.height = `${finalBottomDistance + halfOfThumb}px`;

		this.percentage = percentagePositionToChange;

		window.dispatchEvent(event);
	};

	thumb.addEventListener('mousedown', (e) => {
		document.onmousemove = drag;
	});

	thumb.addEventListener('touchstart', (e) => {
		document.ontouchmove = drag;
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
	document.getElementById('percentage').textContent = parseInt(
		rangeSlider1.percentage,
		10
	);
});
