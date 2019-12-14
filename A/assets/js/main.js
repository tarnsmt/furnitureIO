

(function ($) {

	var $window = $(window),
		$body = $('body'),
		settings = {

			// Carousels
			carousels: {
				speed: 4,
				fadeIn: true,
				fadeDelay: 250
			},

		};

	// Breakpoints.
	breakpoints({
		wide: ['1281px', '1680px'],
		normal: ['961px', '1280px'],
		narrow: ['841px', '960px'],
		narrower: ['737px', '840px'],
		mobile: [null, '736px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Dropdowns.
	$('#nav > ul').dropotron({
		mode: 'fade',
		speed: 350,
		noOpenerFade: true,
		alignment: 'center'
	});

	// Scrolly.
	$('.scrolly').scrolly();

	// Nav.

	// Button.
	$(
		'<div id="navButton">' +
		'<a href="#navPanel" class="toggle"></a>' +
		'</div>'
	)
		.appendTo($body);

	// Panel.
	$(
		'<div id="navPanel">' +
		'<nav>' +
		$('#nav').navList() +
		'</nav>' +
		'</div>'
	)
		.appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			target: $body,
			visibleClass: 'navPanel-visible'
		});

	// Carousels.
	$('.carousel').each(function () {

		var $t = $(this),
			$forward = $('<span class="forward"></span>'),
			$backward = $('<span class="backward"></span>'),
			$reel = $t.children('.reel'),
			$items = $reel.children('article');

		var pos = 0,
			leftLimit,
			rightLimit,
			itemWidth,
			reelWidth,
			timerId;

		// Items.
		if (settings.carousels.fadeIn) {

			$items.addClass('loading');

			$t.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				enter: function () {

					var timerId,
						limit = $items.length - Math.ceil($window.width() / itemWidth);

					timerId = window.setInterval(function () {
						var x = $items.filter('.loading'), xf = x.first();

						if (x.length <= limit) {

							window.clearInterval(timerId);
							$items.removeClass('loading');
							return;

						}

						xf.removeClass('loading');

					}, settings.carousels.fadeDelay);

				}
			});

		}

		// Main.
		$t._update = function () {
			pos = 0;
			rightLimit = (-1 * reelWidth) + $window.width();
			leftLimit = 0;
			$t._updatePos();
		};

		$t._updatePos = function () { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

		// Forward.
		$forward
			.appendTo($t)
			.hide()
			.mouseenter(function (e) {
				timerId = window.setInterval(function () {
					pos -= settings.carousels.speed;

					if (pos <= rightLimit) {
						window.clearInterval(timerId);
						pos = rightLimit;
					}

					$t._updatePos();
				}, 10);
			})
			.mouseleave(function (e) {
				window.clearInterval(timerId);
			});

		// Backward.
		$backward
			.appendTo($t)
			.hide()
			.mouseenter(function (e) {
				timerId = window.setInterval(function () {
					pos += settings.carousels.speed;

					if (pos >= leftLimit) {

						window.clearInterval(timerId);
						pos = leftLimit;

					}

					$t._updatePos();
				}, 10);
			})
			.mouseleave(function (e) {
				window.clearInterval(timerId);
			});

		// Init.
		$window.on('load', function () {

			reelWidth = $reel[0].scrollWidth;

			if (browser.mobile) {

				$reel
					.css('overflow-y', 'hidden')
					.css('overflow-x', 'scroll')
					.scrollLeft(0);
				$forward.hide();
				$backward.hide();

			}
			else {

				$reel
					.css('overflow', 'visible')
					.scrollLeft(0);
				$forward.show();
				$backward.show();

			}

			$t._update();

			$window.on('resize', function () {
				reelWidth = $reel[0].scrollWidth;
				$t._update();
			}).trigger('resize');

		});

	});

})(jQuery);

// card
Vue.config.devtools = true;

Vue.component('card', {
	template: `
    <div class="card-wrap"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="card">
      <div class="card"
        :style="cardStyle">
        <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
        <div class="card-info">
          <slot name="header"></slot>
          <slot name="content"></slot>
        </div>
      </div>
    </div>`,
	mounted() {
		this.width = this.$refs.card.offsetWidth;
		this.height = this.$refs.card.offsetHeight;
	},
	props: ['dataImage'],
	data: () => ({
		width: 0,
		height: 0,
		mouseX: 0,
		mouseY: 0,
		mouseLeaveDelay: null
	}),
	computed: {
		mousePX() {
			return this.mouseX / this.width;
		},
		mousePY() {
			return this.mouseY / this.height;
		},
		cardStyle() {
			const rX = this.mousePX * 15;
			const rY = this.mousePY * -15;
			return {
				transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
			};
		},
		cardBgTransform() {
			const tX = this.mousePX * -10;
			const tY = this.mousePY * -10;
			return {
				transform: `translateX(${tX + 20}px) translateY(${tY + 20}px)`
			}
		},
		cardBgImage() {
			return {
				backgroundImage: `url(${this.dataImage})`
			}
		}
	},
	methods: {
		handleMouseMove(e) {
			this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width / 2;
			this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height / 2;
		},
		handleMouseEnter() {
			clearTimeout(this.mouseLeaveDelay);
		},
		handleMouseLeave() {
			this.mouseLeaveDelay = setTimeout(() => {
				this.mouseX = 0;
				this.mouseY = 0;
			}, 1000);
		}
	}
});

const app = new Vue({
	el: '#app'
});

