const track = document.getElementById('track');
const progress = document.getElementById('progress');
const thumb = document.getElementById('thumb');

const sliders = Array.from(document.querySelectorAll('.slider-container'));

const stringToFragment = (html) =>
	document.createRange().createContextualFragment(html);

const sliderHtml = `
	<div class="track">
		<div class="progress"></div>
		<div class="thumb"></div>
	</div>
	<div>
	<p id="percentage">0</p>
</div>

`;

const createSlider = (parent) => {
	const { height, progressColor } = parent.dataset;
	const sliderFragment = stringToFragment(sliderHtml);
	parent.append(sliderFragment);
	console.log(parent);
	const track = parent.querySelector('.track');
	const progress = parent.querySelector('.progress');

	track.style.height = `${height}px`;
	progress.style.background = progressColor;
};

function rangeSlider(sliderParent) {
	createSlider(sliderParent);

	const track = sliderParent.querySelector('.track');
	const thumb = sliderParent.querySelector('.thumb');
	const progress = sliderParent.querySelector('.progress');

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

		const { progressColor } = sliderParent.dataset;
		const numberElement = sliderParent.querySelector('#percentage');
		const event = new CustomEvent('slider', {
			detail: {
				percentage: percentagePositionToChange,
				color: progressColor,
				numberEl: numberElement,
			},
		});
		window.dispatchEvent(event);
	};

	thumb.addEventListener('mousedown', (e) => {
		document.onmousemove = drag;
	});

	thumb.addEventListener('touchstart', (e) => {
		document.ontouchmove = drag;
	});

	track.addEventListener('mousedown', (e) => {
		drag(e);
		document.onmousemove = drag;
	});

	track.addEventListener('touchstart', (e) => {
		drag(e);
		document.ontouchmove = drag;
	});

	sliderParent.addEventListener('touchend', (e) => {
		if (e.touches.length == 0) {
			document.ontouchmove = null;
		}
	});
}

document.addEventListener('mouseup', () => {
	document.onmousemove = null;
});

sliders.forEach((s) => {
	new rangeSlider(s);
});

window.addEventListener('slider', (e) => {
	const background = document.getElementById('background');
	const { percentage, color, numberEl } = e.detail;

	numberEl.textContent = parseInt(percentage, 10);

	background.style.background = color;
	background.style.height = `${percentage}%`;
});
