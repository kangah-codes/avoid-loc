(
	function( $ ) {
		'use strict';

		$.fn.insightSwiper = function() {
			var $swiper;

			this.each( function() {

				var $slider = $( this );
				var $sliderInner = $slider.children( '.swiper-inner' ).first();
				var _settings = $slider.data();

				if ( _settings.queueInit == '0' ) {
					return;
				}

				var $sliderContainer = $sliderInner.children( '.swiper-container' ).first(),
				    lgItems          = _settings.lgItems ? _settings.lgItems : 1,
				    mdItems          = _settings.mdItems ? _settings.mdItems : lgItems,
				    smItems          = _settings.smItems ? _settings.smItems : mdItems,
				    xsItems          = _settings.xsItems ? _settings.xsItems : smItems,
				    lgGutter         = _settings.lgGutter ? _settings.lgGutter : 0,
				    mdGutter         = _settings.mdGutter ? _settings.mdGutter : lgGutter,
				    smGutter         = _settings.smGutter ? _settings.smGutter : mdGutter,
				    xsGutter         = _settings.xsGutter ? _settings.xsGutter : smGutter,
				    speed            = _settings.speed ? _settings.speed : 1000;

				if ( _settings.slideWrap ) {
					$sliderInner.children( '.swiper-container' )
					            .children( '.swiper-wrapper' )
					            .children( 'div' )
					            .wrap( "<div class='swiper-slide'><div class='swiper-slide-inner'></div></div>" );
				}

				if ( lgItems == 'auto' ) {
					var _options = {
						slidesPerView: 'auto',
						spaceBetween: lgGutter,
						breakpoints: {
							// when window width is >=
							767: {
								spaceBetween: smGutter
							},
							990: {
								spaceBetween: mdGutter
							},
							1199: {
								spaceBetween: lgGutter
							}
						}
					};
				} else {
					var _options = {
						slidesPerView: xsItems, //slidesPerGroup: lgItems,
						spaceBetween: xsGutter,
						breakpoints: {
							// when window width is <=
							767: {
								slidesPerView: smItems,
								spaceBetween: smGutter
							},
							990: {
								slidesPerView: mdItems,
								spaceBetween: mdGutter
							},
							1199: {
								slidesPerView: lgItems,
								spaceBetween: lgGutter
							}
						}
					};

					if ( _settings.slidesPerGroup == 'inherit' ) {
						_options.slidesPerGroup = xsItems;

						_options.breakpoints[ 767 ].slidesPerGroup = smItems;
						_options.breakpoints[ 990 ].slidesPerGroup = mdItems;
						_options.breakpoints[ 1199 ].slidesPerGroup = lgItems;
					}
				}

				_options.el = $sliderContainer;
				_options.init = false;

				_options.watchOverflow = true;

				if ( _settings.slideColumns ) {
					_options.slidesPerColumn = _settings.slideColumns;
				}

				if ( _settings.initialSlide ) {
					_options.initialSlide = _settings.initialSlide;
				}

				if ( _settings.autoHeight ) {
					_options.autoHeight = true;
				}

				if ( speed ) {
					_options.speed = speed;
				}

				// Maybe: fade, flip
				if ( _settings.effect ) {
					_options.effect = _settings.effect;
					/*_options.fadeEffect = {
						crossFade: true
					};*/
				}

				if ( _settings.loop ) {
					_options.loop = true;
				}

				if ( _settings.centered ) {
					_options.centeredSlides = true;
				}

				if ( _settings.autoplay ) {
					_options.autoplay = {
						delay: _settings.autoplay,
						disableOnInteraction: false
					};
				}

				if ( _settings.freemode ) {
					_options.freeMode = true;
				}

				var $wrapTools;

				if ( _settings.wrapTools ) {
					$wrapTools = $( '<div class="swiper-tools"></div>' );

					$slider.append( $wrapTools );
				}

				if ( _settings.nav ) {

					if ( _settings.customNav && _settings.customNav !== '' ) {
						$customBtn = $( '#' + _settings.customNav );
						var $swiperPrev = $customBtn.find( '.slider-prev-btn' );
						var $swiperNext = $customBtn.find( '.slider-next-btn' );
					} else {
						var $swiperPrev = $( '<div class="swiper-nav-button swiper-button-prev"><i class="nav-button-icon"></i></div>' );
						var $swiperNext = $( '<div class="swiper-nav-button swiper-button-next"><i class="nav-button-icon"></i></div>' );

						var $swiperNavButtons = $( '<div class="swiper-nav-buttons"></div>' );
						$swiperNavButtons.append( $swiperPrev ).append( $swiperNext );

						if ( $wrapTools ) {
							$wrapTools.append( $swiperNavButtons );
						} else {
							$sliderInner.append( $swiperNavButtons );
						}
					}

					_options.navigation = {
						nextEl: $swiperNext,
						prevEl: $swiperPrev
					};
				}

				if ( _settings.pagination ) {
					var $swiperPagination = $( '<div class="swiper-pagination"></div>' );

					if ( $wrapTools ) {
						$wrapTools.append( $swiperPagination );
					} else {
						$slider.append( $swiperPagination );
					}

					_options.pagination = {
						el: $swiperPagination,
						clickable: true
					};
				}

				if ( _settings.scrollbar ) {
					var $scrollbar = $( '<div class="swiper-scrollbar"></div>' );
					$sliderContainer.prepend( $scrollbar );

					_options.scrollbar = {
						el: $scrollbar,
						draggable: true,
					};

					_options.loop = false;
				}

				if ( _settings.mousewheel ) {
					_options.mousewheel = {
						enabled: true
					};
				}

				if ( _settings.vertical ) {
					_options.direction = 'vertical'
				}

				$swiper = new Swiper( _options );

				if ( _settings.reinitOnResize ) {
					var _timer;
					$( window ).resize( function() {
						clearTimeout( _timer );

						_timer = setTimeout( function() {
							$swiper.destroy( true, true );

							$swiper = new Swiper( $sliderContainer, _options );
						}, 300 );
					} );
				}

				// Disabled auto play when focus.
				if ( _settings.autoplay ) {
					$sliderContainer.hoverIntent( function() {
						$swiper.autoplay.stop();
					}, function() {
						$swiper.autoplay.start();
					} );
				}

				$swiper.on( 'slideChange', function() {
					update_lazy_images( $slider );
				} );

				$swiper.on( 'init', function() {
					update_lazy_images( $slider );
				} );

				$swiper.init();

				$( document ).trigger( 'insightSwiperInit', [ $swiper, $slider, _options ] );
			} );

			return $swiper;
		};

		function update_lazy_images( $slider ) {
			var llImages = $slider.find( '.ll-notloaded' );

			if ( llImages.length > 0 ) {
				llImages.each( function( index, img ) {

					//$( img ).trigger( 'laziestloader' );

					$( img ).laziestloader().removeClass( 'unload' );
				} );
			}
		}
	}( jQuery )
);

jQuery( document ).ready( function( $ ) {
	'use strict';

var $window            = $( window ),
    $html              = $( 'html' ),
    $body              = $( 'body' ),
    $pageWrapper       = $( '#page' ),
    $pageHeader        = $( '#page-header' ),
    $headerInner       = $( '#page-header-inner' ),
    $pageContent       = $( '#page-content' ),
    headerStickyEnable = $insight.header_sticky_enable,
    headerStickyHeight = parseInt( $insight.header_sticky_height ),
    queueResetDelay,
    animateQueueDelay  = 200,
    wWidth             = window.innerWidth;
/**
 * Global ajaxBusy = false
 * Desc: Status of ajax
 */
var ajaxBusy = false;
$( document ).ajaxStart( function() {
	ajaxBusy = true;
} ).ajaxStop( function() {
	ajaxBusy = false;
} );

$( window ).on( 'resize', function() {
	$body.addClass( 'window-resized' );
	wWidth = window.innerWidth;

	calMobileMenuBreakpoint();
	reCalculateVcRowFullHeight();
	boxedFixVcRow();
	calculateLeftHeaderSize();
	initStickyHeader();
	initFooterParallax();
	initFooterFixed();
} );

$( window ).on( 'load', function() {
	initPreLoader();
	initStickyHeader();

	window.dispatchEvent( new Event( 'resize' ) );
} );

initLazyLoaderImages();

// Call functions in load event to make header sticky working properly.
initQueueAnimationForElements();
initAnimationForElements();

calMobileMenuBreakpoint();
reCalculateVcRowFullHeight();
boxedFixVcRow();

marqueBackground();
scrollToTop();
// Remove empty p tags form wpautop.
$( 'p:empty' ).remove();

calculateLeftHeaderSize();

insightInitGrid();
initSliders();

setTimeout( function() {
	navOnePage();
}, 100 );

$body.on( 'click', '.vc_tta-tab, .vc_tta-panel', function() {
	var $tabs = $( this ).parents( '.vc_general' ).first();

	$tabs.find( '.ll-image' ).laziestloader( { threshold: 100 } ).removeClass( 'unload' );

	$( window ).trigger( 'resize' );
} );

initFooterParallax();
initFooterFixed();
initSmoothScrollLinks();
initLightGalleryPopups();
initVideoPopups();
initMapPopups();
initSearchPopup();
initHeaderRightMoreTools();
initOffSidebar();

insightInitSmartmenu();
initOffCanvasMenu();
initMobileMenu();
initCookieNotice();
initNewsletterPopup();
handlerEntryPostShare();

function initSliders() {
	$( '.mitech-swiper' ).each( function() {
		if ( $( this ).hasClass( 'mitech-swiper-linked-yes' ) ) {
			var mainSlider = $( this ).children( '.mitech-main-swiper' ).insightSwiper();
			var thumbsSlider = $( this ).children( '.mitech-thumbs-swiper' ).insightSwiper();

			mainSlider.controller.control = thumbsSlider;
			thumbsSlider.controller.control = mainSlider;
		} else {
			$( this ).insightSwiper();
		}
	} );
}

function initPreLoader() {
	setTimeout( function() {
		$body.addClass( 'loaded' );
	}, 200 );

	var $loader = $( '#page-preloader' );

	setTimeout( function() {
		$loader.remove();
	}, 2000 );
}

function initLightGalleryPopups() {
	$( '.tm-light-gallery' ).each( function() {
		insightInitLightGallery( $( this ) );
	} );
}

function initVideoPopups() {
	$( '.tm-popup-video' ).each( function() {
		handlerPopupVideo( $( this ) );
	} );
}

function handlerPopupVideo( $popup ) {
	var options = {
		selector: 'a',
		fullScreen: false,
		zoom: false
	};
	$popup.lightGallery( options );
}

function initMapPopups() {
	$( '.tm-popup-map' ).each( function() {
		handlerPopupMap( $( this ).children( 'a' ) );
	} );
}

function handlerPopupMap( $popup ) {
	var options = {
		selector: 'this',
		iframeMaxWidth: '80%',
		autoplay: false,
		fullScreen: false,
		zoom: false,
		hash: false,
		share: false,
		pager: false,
		animateThumb: false,
		showThumbByDefault: false,
		getCaptionFromTitleOrAlt: false
	};
	$popup.lightGallery( options );
}

function marqueBackground() {
	$( '.background-marque' ).each( function() {
		var $el = $( this );
		var x = 0;
		var step = 1;
		var speed = 10;

		if ( $el.hasClass( 'to-left' ) ) {
			step = - 1;
		}

		$el.css( 'background-repeat', 'repeat-x' );

		var loop = setInterval( function() {
			x += step;
			$el.css( 'background-position-x', x + 'px' );
		}, speed );

		if ( $el.data( 'marque-pause-on-hover' ) == true ) {
			$( this ).hoverIntent( function() {
				clearInterval( loop );
			}, function() {
				loop = setInterval( function() {
					x += step;
					$el.css( 'background-position-x', x + 'px' );
				}, speed );
			} );
		}
	} );
}

function initSmoothScrollLinks() {
	// Allows for easy implementation of smooth scrolling for buttons.
	$( '.smooth-scroll-link' ).on( 'click', function( e ) {
		var href = $( this ).attr( 'href' );

		if ( ! href ) {
			href = $( this ).data( 'href' );
		}

		var _wWidth = window.innerWidth;
		if ( href.match( /^([.#])(.+)/ ) ) {
			e.preventDefault();
			var offset = 0;
			if ( $insight.header_sticky_enable == 1 && $pageHeader.length > 0 && $headerInner.data( 'sticky' ) == '1' ) {

				if ( $headerInner.data( 'header-position' ) === 'left' ) {
					if ( _wWidth < $insight.mobile_menu_breakpoint ) {
						offset += headerStickyHeight;
					}
				} else {
					offset += headerStickyHeight;
				}
			}

			// Add offset of admin bar when viewport min-width 600.
			if ( _wWidth > 600 ) {
				var adminBarHeight = $( '#wpadminbar' ).height();
				offset += adminBarHeight;
			}

			$.smoothScroll( {
				offset: - offset,
				scrollTarget: $( href ),
				speed: 600,
				easing: 'linear'
			} );
		}
	} );
}

function initAnimationForElements() {
	if ( ! $body.hasClass( 'page-has-animation' ) ) {
		return;
	}

	var $animations = $pageContent.find( '.tm-animation' );

	$animations.vcwaypoint( function() {
		// Fix for different ver of waypoints plugin.
		var _self = this.element ? this.element : $( this );
		$( _self ).addClass( 'animate' );
	}, {
		offset: '100%' // triggerOnce: true
	} );
}

function initQueueAnimationForElements() {
	$( '.tm-animation-queue' ).each( function() {
		var itemQueue  = [],
		    queueTimer,
		    queueDelay = $( this ).data( 'animation-delay' ) ? $( this ).data( 'animation-delay' ) : animateQueueDelay;

		$( this ).children( '.item' ).vcwaypoint( function() {
			// Fix for different ver of waypoints plugin.
			var _self = this.element ? this.element : $( this );

			queueResetDelay = setTimeout( function() {
				queueDelay = animateQueueDelay;
			}, animateQueueDelay );

			itemQueue.push( _self );
			processItemQueue( itemQueue, queueDelay, queueTimer );
			queueDelay += animateQueueDelay;
		}, {
			offset: '90%',
			triggerOnce: true
		} );
	} );
}

function processItemQueue( itemQueue, queueDelay, queueTimer, queueResetDelay ) {
	clearTimeout( queueResetDelay );
	queueTimer = window.setInterval( function() {
		if ( itemQueue !== undefined && itemQueue.length ) {
			$( itemQueue.shift() ).addClass( 'animate' );
			processItemQueue();
		} else {
			window.clearInterval( queueTimer );
		}
	}, queueDelay );
}

function insightInitSmartmenu() {
	var $primaryMenu = $pageHeader.find( '#page-navigation' ).find( 'ul' ).first();

	if ( ! $primaryMenu.hasClass( 'sm' ) ) {
		return;
	}

	$primaryMenu.smartmenus( {
		subMenusSubOffsetX: 0,
		subMenusSubOffsetY: - 17
	} );

	// Add animation for sub menu.
	$primaryMenu.on( {
		'show.smapi': function( e, menu ) {
			$( menu ).removeClass( 'hide-animation' ).addClass( 'show-animation' );
		},
		'hide.smapi': function( e, menu ) {
			$( menu ).removeClass( 'show-animation' ).addClass( 'hide-animation' );
		}
	} ).on( 'animationend webkitAnimationEnd oanimationend MSAnimationEnd', 'ul', function( e ) {
		$( this ).removeClass( 'show-animation hide-animation' );
		e.stopPropagation();
	} );
}

function insightInitLightGallery( $gallery ) {
	var _download   = (
		    $insight.light_gallery_download === '1'
	    ),
	    _autoPlay   = (
		    $insight.light_gallery_auto_play === '1'
	    ),
	    _zoom       = (
		    $insight.light_gallery_zoom === '1'
	    ),
	    _fullScreen = (
		    $insight.light_gallery_full_screen === '1'
	    ),
	    _share      = (
		    $insight.light_gallery_share === '1'
	    ),
	    _thumbnail  = (
		    $insight.light_gallery_thumbnail === '1'
	    );

	var options = {
		selector: '.zoom',
		thumbnail: _thumbnail,
		download: _download,
		autoplay: _autoPlay,
		zoom: _zoom,
		share: _share,
		fullScreen: _fullScreen,
		hash: false,
		animateThumb: false,
		showThumbByDefault: false,
		getCaptionFromTitleOrAlt: false
	};

	$gallery.lightGallery( options );
}

function animateMagicLineOnScroll( $li, onScroll ) {
	if ( onScroll == false ) {
		$li.siblings( 'li' ).removeClass( 'current-menu-item' );
		$li.addClass( 'current-menu-item' );
	}
}

function navOnePage() {
	if ( ! $body.hasClass( 'one-page' ) ) {
		return;
	}
	var $header = $( '#page-header' );
	var $headerInner = $header.children( '#page-header-inner' );
	var $mainNav = $( '#page-navigation' ).find( '.menu__container' ).first();
	var $li = $mainNav.children( '.menu-item' );
	var $links = $li.children( 'a[href*="#"]:not([href="#"])' );
	var onScroll = false;

	var offset = 0;

	if ( $body.hasClass( 'admin-bar' ) ) {
		offset += 32;
	}

	if ( headerStickyEnable == 1 && $headerInner.data( 'sticky' ) == '1' ) {
		offset += headerStickyHeight;
		offset = - offset;
	}

	$li.each( function() {
		if ( $( this ).hasClass( 'current-menu-item' ) ) {
			var _link = $( this ).children( 'a' );

			if ( _link[ 0 ].hash !== '' ) {
				$( this ).removeClass( 'current-menu-item' );
			}
		}
	} );

	$links.each( function() {
		var $this = $( this );
		var id = this.hash;
		var parent = $this.parent();

		if ( $( id ).length > 0 ) {
			$( id ).vcwaypoint( function( direction ) {
				if ( direction === 'down' ) {
					animateMagicLineOnScroll( parent, onScroll );
				}
			}, {
				offset: '25%'
			} );

			$( id ).vcwaypoint( function( direction ) {
				if ( direction === 'up' ) {
					animateMagicLineOnScroll( parent, onScroll );
				}
			}, {
				offset: '-25%'
			} );
		}
	} );

	// Allows for easy implementation of smooth scrolling for navigation links.
	$links.on( 'click', function() {
		var $this = $( this );
		var href = this.hash;
		var parent = $this.parent( 'li' );

		parent.siblings( 'li' ).removeClass( 'current-menu-item' );
		parent.addClass( 'current-menu-item' );

		if ( $( href ).length > 0 ) {
			$.smoothScroll( {
				offset: offset,
				scrollTarget: $( href ),
				speed: 600,
				easing: 'linear',
				beforeScroll: function() {
					onScroll = true;
				},
				afterScroll: function() {
					onScroll = false;
				}
			} );
		}

		return false;
	} );

	// Smooth scroll to section if url has hash tag when page loaded.
	var hashTag = window.location.hash;
	if ( hashTag && $( hashTag ).length > 0 ) {
		$.smoothScroll( {
			offset: offset,
			scrollTarget: $( hashTag ),
			speed: 600,
			easing: 'linear',
			beforeScroll: function() {
				onScroll = true;
			},
			afterScroll: function() {
				onScroll = false;
			}
		} );
	}
}

function initFooterParallax() {
	var footerWrap = $( '#page-footer-wrapper' );

	if ( ! footerWrap.hasClass( 'parallax' ) || $body.hasClass( 'page-template-one-page-scroll' ) ) {
		return;
	}

	if ( footerWrap.length > 0 ) {
		var contentWrap = $pageWrapper.children( '.content-wrapper' );
		if ( wWidth >= 1024 ) {
			var fwHeight = footerWrap.height();
			$body.addClass( 'page-footer-parallax' );
			contentWrap.css( {
				marginBottom: fwHeight
			} );
		} else {
			$body.removeClass( 'page-footer-parallax' );
			contentWrap.css( {
				marginBottom: 0
			} );
		}
	}
}

function initFooterFixed() {
	var footerWrap = $( '#page-footer-wrapper' );

	if ( ! footerWrap.hasClass( 'fixed' ) || $body.hasClass( 'page-template-one-page-scroll' ) ) {
		return;
	}

	if ( footerWrap.length > 0 ) {
		var contentWrap = $pageWrapper.children( '.content-wrapper' );

		var fwHeight = footerWrap.height();
		$body.addClass( 'page-footer-fixed' );
		contentWrap.css( {
			marginBottom: fwHeight
		} );
	}
}

function scrollToTop() {
	if ( $insight.scroll_top_enable != 1 ) {
		return;
	}
	var $scrollUp = $( '#page-scroll-up' );
	var lastScrollTop = 0;

	$window.scroll( function() {
		var st = $( this ).scrollTop();
		if ( st > lastScrollTop ) {
			$scrollUp.removeClass( 'show' );
		} else {
			if ( $window.scrollTop() > 200 ) {
				$scrollUp.addClass( 'show' );
			} else {
				$scrollUp.removeClass( 'show' );
			}
		}
		lastScrollTop = st;
	} );

	$scrollUp.on( 'click', function( evt ) {
		$( 'html, body' ).animate( { scrollTop: 0 }, 600 );
		evt.preventDefault();
	} );
}

function openMobileMenu() {
	$body.addClass( 'page-mobile-menu-opened' );

	$( document ).trigger( 'mobileMenuOpen' );
}

function closeMobileMenu() {
	$body.removeClass( 'page-mobile-menu-opened' );

	$( document ).trigger( 'mobileMenuClose' );
}

function calMobileMenuBreakpoint() {
	var _breakpoint = $insight.mobile_menu_breakpoint;
	if ( wWidth <= _breakpoint ) {
		$body.removeClass( 'desktop-menu' ).addClass( 'mobile-menu' );
	} else {
		$body.addClass( 'desktop-menu' ).removeClass( 'mobile-menu' );
	}
}

function initMobileMenu() {
	$( '#page-open-mobile-menu' ).on( 'click', function( e ) {
		e.preventDefault();
		e.stopPropagation();

		openMobileMenu();
	} );

	$( '#page-close-mobile-menu' ).on( 'click', function( e ) {
		e.preventDefault();
		e.stopPropagation();

		closeMobileMenu();
	} );

	$( '#page-mobile-main-menu' ).on( 'click', function( e ) {
		if ( e.target !== this ) {
			return;
		}

		closeMobileMenu();
	} );

	$( document ).on( 'mobileMenuOpen', function() {
		$html.css( {
			'overflow': 'hidden'
		} );
	} );

	$( document ).on( 'mobileMenuClose', function() {
		$html.css( {
			'overflow': ''
		} );
	} );

	var menu = $( '#mobile-menu-primary' );

	menu.on( 'click', 'a', function( e ) {
		var $this = $( this );
		var _li = $( this ).parent( 'li' );
		var href = $this.attr( 'href' );

		if ( $body.hasClass( 'one-page' ) && href && href.match( /^([.#])(.+)/ ) ) {
			closeMobileMenu();
			var offset = 0;

			if ( $body.hasClass( 'admin-bar' ) ) {
				offset += 32;
			}

			if ( headerStickyEnable == 1 && $headerInner.data( 'sticky' ) == '1' ) {
				offset += headerStickyHeight;
			}

			if ( offset > 0 ) {
				offset = - offset;
			}

			_li.siblings( 'li' ).removeClass( 'current-menu-item' );
			_li.addClass( 'current-menu-item' );

			setTimeout( function() {
				$.smoothScroll( {
					offset: offset,
					scrollTarget: $( href ),
					speed: 600,
					easing: 'linear'
				} );
			}, 300 );

			return false;
		}
	} );

	menu.on( 'click', '.toggle-sub-menu', function( e ) {
		var _li = $( this ).parents( 'li' ).first();

		e.preventDefault();
		e.stopPropagation();

		var _friends = _li.siblings( '.opened' );
		_friends.removeClass( 'opened' );
		_friends.find( '.opened' ).removeClass( 'opened' );
		_friends.find( '.sub-menu' ).stop().slideUp();

		if ( _li.hasClass( 'opened' ) ) {
			_li.removeClass( 'opened' );
			_li.find( '.opened' ).removeClass( 'opened' );
			_li.find( '.sub-menu' ).stop().slideUp();
		} else {
			_li.addClass( 'opened' );
			_li.children( '.sub-menu' ).stop().slideDown();
		}
	} );
}

function initOffCanvasMenu() {
	var menu = $( '#off-canvas-menu-primary' );
	var _lv1 = menu.children( 'li' );

	$( '#page-open-main-menu' ).on( 'click', function( e ) {
		e.preventDefault();
		$body.addClass( 'page-off-canvas-menu-opened' );
	} );

	$( '#page-close-main-menu' ).on( 'click', function( e ) {
		e.preventDefault();

		menu.fadeOut( function() {
			$body.removeClass( 'page-off-canvas-menu-opened' );
			menu.fadeIn();
			menu.find( '.sub-menu' ).slideUp();
		} );
	} );

	var transDelay = 0.1;
	_lv1.each( function() {
		$( this )[ 0 ].setAttribute( 'style', '-webkit-transition-delay:' + transDelay + 's; -moz-transition-delay:' + transDelay + 's; -ms-transition-delay:' + transDelay + 's; -o-transition-delay:' + transDelay + 's; transition-delay:' + transDelay + 's' );
		transDelay += 0.1;
	} );

	menu.on( 'click', '.menu-item-has-children > a, .page_item_has_children > a', function( e ) {
		e.preventDefault();
		e.stopPropagation();

		var _li = $( this ).parent( 'li' );
		var _friends = _li.siblings( '.opened' );
		_friends.removeClass( 'opened' );
		_friends.find( '.opened' ).removeClass( 'opened' );
		_friends.find( '.sub-menu, .children' ).stop().slideUp();

		if ( _li.hasClass( 'opened' ) ) {
			_li.removeClass( 'opened' );
			_li.find( '.opened' ).removeClass( 'opened' );
			_li.find( '.sub-menu, .children' ).stop().slideUp();
		} else {
			_li.addClass( 'opened' );
			_li.children( '.sub-menu, .children' ).stop().slideDown();
		}
	} );
}

function initStickyHeader() {
	var $headerHolder = $pageHeader.children( '.page-header-place-holder' );
	if ( $insight.header_sticky_enable == 1 && $pageHeader.length > 0 && $headerInner.data( 'sticky' ) == '1' ) {
		if ( $headerInner.data( 'header-position' ) != 'left' ) {
			var _hOffset = $headerInner.offset().top;

			// Fix offset top return negative value on some devices.
			if ( _hOffset < 0 ) {
				_hOffset = 0;
			}

			var _hHeight = $headerInner.outerHeight();
			var offset = _hOffset + _hHeight + 100;

			if ( ! $pageHeader.hasClass( 'header-layout-fixed' ) ) {
				var _hHeight = $headerInner.outerHeight();

				$headerHolder.height( _hHeight );
				$headerInner.addClass( 'held' );
			}

			$pageHeader.headroom( {
				offset: offset,
				onTop: function() {
					if ( ! $pageHeader.hasClass( 'header-layout-fixed' ) ) {

						setTimeout( function() {
							var _hHeight = $headerInner.outerHeight();

							$headerHolder.height( _hHeight );
						}, 300 );
					}
				},
			} );
		} else {
			if ( wWidth <= $insight.mobile_menu_breakpoint ) {
				if ( ! $pageHeader.data( 'headroom' ) ) {
					var _hOffset = $headerInner.offset().top;

					// Fix offset top return negative value on some devices.
					if ( _hOffset < 0 ) {
						_hOffset = 0;
					}

					var _hHeight = $headerInner.outerHeight();
					var offset = _hOffset + _hHeight + 100;

					$pageHeader.headroom( {
						offset: offset
					} );
				}
			} else {
				if ( $pageHeader.data( 'headroom' ) ) {
					$pageHeader.data( 'headroom' ).destroy();
					$pageHeader.removeData( 'headroom' );
				}
			}
		}
	}
}

function openSearchPopup() {
	$body.addClass( 'page-search-popup-opened' );

	$html.css( {
		'overflow': 'hidden'
	} );

	/*var popupSearch = $( '#page-search-popup' );
	var searchField = popupSearch.find( '.search-field' );

	setTimeout( function() {
		searchField.focus();
	}, 500 );*/
}

function closeSearchPopup() {
	$body.removeClass( 'page-search-popup-opened' );

	$html.css( {
		'overflow': ''
	} );
}

function initSearchPopup() {
	$( '#btn-open-popup-search' ).on( 'click', function( e ) {
		e.preventDefault();
		openSearchPopup();
	} );

	$( '#search-popup-close' ).on( 'click', function( e ) {
		e.preventDefault();
		closeSearchPopup();
	} );
}


function openOffSidebar() {
	$body.addClass( 'page-off-sidebar-opened' );
}

function closeOffSidebar() {
	$body.removeClass( 'page-off-sidebar-opened' );
}

function initOffSidebar() {
	$( '#page-open-off-sidebar' ).on( 'click', function( e ) {
		e.preventDefault();
		openOffSidebar();
	} );

	$( '#page-close-off-sidebar' ).on( 'click', function( e ) {
		e.preventDefault();
		closeOffSidebar();
	} );

	var offSidebar = $( '#page-off-sidebar' );

	offSidebar.on( 'click', function( e ) {
		if ( e.target !== this ) {
			return;
		}

		closeOffSidebar();
	} );
}

function initHeaderRightMoreTools() {
	$( '#header-right-more' ).on( 'click', function() {
		$body.toggleClass( 'header-more-tools-opened' );
	} );


	$( document ).on( 'click', function( evt ) {
		if ( evt.target.id === 'page-header-inner' ) {
			return;
		}

		if ( $( evt.target ).closest( '#page-header-inner' ).length ) {
			return;
		}

		$body.removeClass( 'header-more-tools-opened' );
	} );
}

function calculateLeftHeaderSize() {
	if ( $headerInner.data( 'header-position' ) != 'left' ) {
		return;
	}

	var _wWidth = window.innerWidth;
	var _containerWidth = parseInt( $body.data( 'site-width' ) );
	var $footer = $( '#page-footer-wrapper' );

	if ( _wWidth <= $insight.mobile_menu_breakpoint ) {
		$html.css( {
			marginLeft: 0
		} );

		if ( $footer.hasClass( 'parallax' ) || $footer.hasClass( 'fixed' ) || $footer.hasClass( 'overlay' ) ) {
			$footer.css( {
				left: 0
			} );
		}
	} else {
		var headerWidth = $headerInner.outerWidth();
		$html.css( {
			marginLeft: headerWidth + 'px'
		} );

		if ( $footer.hasClass( 'parallax' ) || $footer.hasClass( 'fixed' ) || $footer.hasClass( 'overlay' ) ) {
			$footer.css( {
				left: headerWidth + 'px'
			} );
		}

		var rows = $( '#page-main-content' ).find( '.vc_row, .vc_section' );
		var footerRows = $footer.find( '.page-footer-inner' ).first().find( '.vc_row, .vc_section' );
		rows = rows.add( footerRows );

		var $contentWidth = $( '#page' ).width();
		rows.each( function() {
			if ( $( this ).attr( 'data-vc-full-width' ) ) {
				var left = 0;

				if ( $contentWidth > $insight.mobile_menu_breakpoint ) {
					left = - (
						(
							$contentWidth - _containerWidth
						) / 2
					) + 'px';
				}
				var width = $contentWidth + 'px';
				$( this ).css( {
					left: left,
					width: width
				} );

				var stretch = $( this ).attr( 'data-vc-stretch-content' );
				if ( typeof stretch === typeof undefined || stretch === false ) {
					var _padding = 0;
					if ( $contentWidth > $insight.mobile_menu_breakpoint ) {
						_padding = (
							(
								$contentWidth - _containerWidth
							) / 2
						);
					}
					$( this ).css( {
						paddingLeft: _padding,
						paddingRight: _padding
					} );
				}
			}
		} );
	}
}

function boxedFixVcRow() {
	if ( ! $body.hasClass( 'boxed' ) ) {
		return;
	}

	if ( wWidth < 1200 ) {
		return;
	}

	var siteWidth    = $pageWrapper.outerWidth(),
	    contentWidth = $body.data( 'content-width' ),
	    space        = (
		                   siteWidth - contentWidth
	                   ) / 2;

	var breakpoint = Math.min( siteWidth, contentWidth );

	$pageWrapper.find( '[data-vc-full-width=true]' ).each( function() {
		$( this ).css( {
			left: - space,
			width: siteWidth + 'px'
		} );

		if ( $( this ).data( 'vc-stretch-content' ) != true ) {
			$( this ).css( {
				paddingLeft: space,
				paddingRight: space
			} );
		}
	} );
}

function reCalculateVcRowFullHeight() {
	var fullHeight = window.innerHeight,
	    fullHeightCal,
	    offset     = 0,
	    $adminBar  = $( '#wpadminbar' ),
	    $vcRows    = $( '.vc_row-o-full-height' );

	if ( $adminBar.length ) {
		offset += $adminBar.outerHeight();
	}

	$headerInner = $pageHeader.children( '.page-header-inner' );

	if ( ! $pageHeader.hasClass( 'header-layout-fixed' ) &&
	     (
		     $body.hasClass( 'handheld' ) || $headerInner.data( 'header-position' ) === undefined
	     ) ) {
		var hHeight = $headerInner.outerHeight();

		offset += hHeight;
	}

	fullHeightCal = fullHeight - offset;

	$vcRows.each( function() {
		if ( $( this ).hasClass( 'calculated-height' ) ) {
			$vcRows.css( 'min-height', fullHeightCal + 'px' );
		} else {
			$vcRows.css( 'min-height', fullHeight + 'px' );
		}
	} );

	$( document ).trigger( 'vc-full-height-row', $vcRows );
}

function handlerEntryPostShare() {
	$( '.post-share' ).each( function() {
		var self = $( this );
		var $toggle = self.find( '.share-icon' );

		$toggle.on( 'click', function() {
			self.toggleClass( 'opened' );
		} );

		$( document ).on( 'click', function( e ) {
			if ( $( e.target ).closest( $toggle ).length == 0 ) {
				self.removeClass( 'opened' );
			}
		} );
	} );

}

function initCookieNotice() {
	if ( $insight.noticeCookieEnable == 1 && $insight.noticeCookieConfirm != 'yes' && $insight.noticeCookieMessages != '' ) {

		$.growl( {
			location: 'br',
			fixed: true,
			duration: 3600000,
			size: 'large',
			title: '',
			message: $insight.noticeCookieMessages
		} );

		$( '#tm-button-cookie-notice-ok' ).on( 'click', function() {
			$( this ).parents( '.growl-message' ).first().siblings( '.growl-close' ).trigger( 'click' );

			var _data = {
				action: 'notice_cookie_confirm'
			};

			_data = $.param( _data );

			$.ajax( {
				url: $insight.ajaxurl,
				type: 'POST',
				data: _data,
				dataType: 'json',
				success: function( results ) {

				},
				error: function( errorThrown ) {
					console.log( errorThrown );
				}
			} );
		} );
	}
}

function initNewsletterPopup() {
	if ( $insight.isShowNewsletterPopup != '1' ) {
		return false;
	}

	$( window ).on( 'load', function() {
		$body.addClass( 'newsletter-popup-opened' );
	} );

	$( '#newsletter-popup-close' ).on( 'click', function() {
		$( document ).trigger( 'newsletterPopupClose' );
	} );

	var newsletterPopup = $( '#newsletter-popup' );

	newsletterPopup.on( 'click', function( e ) {
		if ( e.target !== this ) {
			return;
		}

		$( document ).trigger( 'newsletterPopupClose' );
	} );

	$( document ).on( 'newsletterPopupClose', function() {
		$body.removeClass( 'newsletter-popup-opened' );

		var data = {
			action: 'newsletter_popup_confirm'
		};

		data = $.param( data );

		$.ajax( {
			url: $insight.ajaxurl,
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function( results ) {

			},
			error: function( errorThrown ) {
				console.log( errorThrown );
			}
		} );
	} );
}

function initLazyLoaderImages() {
	var llImages = $( '.ll-image' );

	handlerLazyLoaderImages( llImages );
}

function handlerLazyLoaderImages( images ) {
	images.laziestloader( {}, function() {
		$( this ).removeClass( 'unload' );
	} );
}

var resizeTimer;

if ( typeof Isotope != 'undefined' ) {
	// Add isotope-hidden class for filtered items.
	var itemReveal = Isotope.Item.prototype.reveal,
	    itemHide   = Isotope.Item.prototype.hide;

	Isotope.Item.prototype.reveal = function() {
		itemReveal.apply( this, arguments );
		$( this.element )
			.removeClass( 'isotope-hidden' );
	};

	Isotope.Item.prototype.hide = function() {
		itemHide.apply( this, arguments );
		$( this.element )
			.addClass( 'isotope-hidden' );
	};
}

function insightInitGrid() {
	$( '.tm-grid-wrapper' ).each( function() {
		var $el      = $( this ),
		    $grid    = $el.find( '.tm-grid' ),
		    $gridData,
		    gutter   = $el.data( 'gutter' ) ? $el.data( 'gutter' ) : 0,
		    itemWrap = $el.data( 'item-wrap' );

		if ( itemWrap == '1' ) {
			$grid.children().not( '.grid-sizer' )
			     .wrap( '<div class="grid-item"></div>' );
		}

		var $items = $grid.children( '.grid-item' );

		$( document ).trigger( 'insightGridBeforeInit', [ $el, $grid ] );

		if ( $el.data( 'type' ) == 'masonry' ) {
			var $isotopeOptions = {
				itemSelector: '.grid-item',
				percentPosition: true
			};

			if ( $el.data( 'grid-fitrows' ) ) {
				$isotopeOptions.layoutMode = 'fitRows';
			} else {
				$isotopeOptions.layoutMode = 'packery';
				$isotopeOptions.packery = {
					// Use outer width of grid-sizer for columnWidth.
					columnWidth: '.grid-sizer'
				}
			}

			if ( $isotopeOptions.layoutMode === 'fitRows' ) {
				// Set gutter for fit rows layout.
				$isotopeOptions.fitRows = {};
				$isotopeOptions.fitRows.gutter = gutter;
			} else if ( $isotopeOptions.layoutMode === 'packery' ) {
				$isotopeOptions.packery.gutter = gutter;
			} else {
				// Set gutter for masonry layout.
				$isotopeOptions.masonry.gutter = gutter;
			}

			// Remove default transition if grid has custom animation.
			if ( $grid.hasClass( 'has-animation' ) ) {
				$isotopeOptions.transitionDuration = 0;
			}

			$( window ).resize( function() {
				insightGridMasonryCalculateSize( $el, $grid, $isotopeOptions );
				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( function() {
					// Run code here, resizing has "stopped"
					insightGridMasonryCalculateSize( $el, $grid, $isotopeOptions );
				}, 300 );
			} );

			insightGridMasonryCalculateSize( $el, $grid );

			$gridData = $grid.imagesLoaded( function() {
				// init Isotope after all images have loaded
				$grid.isotope( $isotopeOptions );

				if ( $el.data( 'match-height' ) ) {
					$items.matchHeight();
				}

				$( document ).trigger( 'insightGridInit', [ $el, $grid, $isotopeOptions ] );
			} );

			$gridData.one( 'arrangeComplete', function() {
				insightInitGridAnimation( $grid, $items );
				insightGridFilterCount( $el, $grid );
				initGridTiltEffect( $el, $items );
			} );
		} else if ( $el.data( 'type' ) == 'justified' ) {
			var jRowHeight        = $el.data( 'justified-height' ) ? $el.data( 'justified-height' ) : 300,
			    jMaxRowHeight     = $el.data( 'justified-max-height' ) ? $el.data( 'justified-max-height' ) : 0,
			    jLastRow          = $el.data( 'justified-last-row' ) ? $el.data( 'justified-last-row' ) : 'justify',
			    $justifiedOptions = {
				    rowHeight: jRowHeight,
				    selector: '.grid-item',
				    imgSelector: '.post-thumbnail img',
				    margins: gutter,
				    border: 0,
				    captions: false,
				    lastRow: jLastRow
			    };

			if ( jMaxRowHeight && jMaxRowHeight > 0 ) {
				$justifiedOptions.maxRowHeight = jMaxRowHeight;
			}

			$grid.justifiedGallery( $justifiedOptions );
			insightGridFilterCount( $el, $grid );
			insightInitGridAnimation( $grid, $items );
			initGridTiltEffect( $el, $items );
		} else {
			insightGridFilterCount( $el, $grid );
			insightInitGridAnimation( $grid, $items );
			initGridTiltEffect( $el, $items );
		}

		insightGridFilterHandler( $el, $grid );

		if ( $el.data( 'hover' ) == 'tilt' ) {
			var zIndex = 1;

			$grid.on( 'mouseenter', '.grid-item', function() {
				zIndex ++;

				$( this ).css( 'z-index', zIndex );
			} );
		}

		if ( $el.data( 'pagination' ) == 'loadmore' ) {
			$el.children( '.tm-grid-pagination' )
			   .find( '.tm-grid-loadmore-btn' )
			   .on( 'click', function( e ) {
				   e.preventDefault();
				   if ( ! ajaxBusy ) {
					   $( this ).hide();
					   var $queryInput = $el.find( '.tm-grid-query' )
					                        .first();
					   var query = jQuery.parseJSON( $queryInput.val() );

					   query.paged ++;
					   $queryInput.val( JSON.stringify( query ) );
					   insightInfiniteQuery( $el, $grid );
				   }
			   } );
		} else if ( $el.data( 'pagination' ) == 'loadmore_alt' ) {
			var loadMoreBtn = $( $el.data( 'pagination-custom-button-id' ) );

			loadMoreBtn.on( 'click', function( e ) {
				e.preventDefault();
				if ( ! ajaxBusy ) {
					$( this ).hide();
					var $queryInput = $el.find( '.tm-grid-query' )
					                     .first();
					var query = jQuery.parseJSON( $queryInput.val() );

					query.paged ++;
					$queryInput.val( JSON.stringify( query ) );
					insightInfiniteQuery( $el, $grid );
				}
			} );
		} else if ( $el.data( 'pagination' ) == 'infinite' ) {
			$( '.tm-grid-pagination', $el ).vcwaypoint( function( direction ) {
				if ( direction === 'down' && ! ajaxBusy ) {
					var $queryInput = $el.find( '.tm-grid-query' )
					                     .first();
					var query = jQuery.parseJSON( $queryInput.val() );

					query.paged ++;
					$queryInput.val( JSON.stringify( query ) );

					insightInfiniteQuery( $el, $grid );
				}
			}, {
				offset: '100%'
			} )
		}
	} );

	$( document ).on( 'insightGridInfinityLoad', function( e, $wrapper ) {
		var $el = $( $wrapper );
		var $grid = $el.find( '.tm-grid' )
		var $queryInput = $el.find( '.tm-grid-query' )
		                     .first();
		var query = jQuery.parseJSON( $queryInput.val() );

		query.paged = 1;
		$queryInput.val( JSON.stringify( query ) );

		insightInfiniteQuery( $el, $grid, true );
	} );
}

/**
 * Calculate size for grid items
 */
function insightGridMasonryCalculateSize( $el, $grid, $isotopeOptions ) {
	var windowWidth = window.innerWidth,
	    $gridWidth  = $grid[ 0 ].getBoundingClientRect().width,
	    $gutter     = $el.data( 'gutter' ) ? $el.data( 'gutter' ) : 0,
	    $column     = 1,
	    lgColumns   = $el.data( 'lg-columns' ) ? $el.data( 'lg-columns' ) : 1,
	    mdColumns   = $el.data( 'md-columns' ) ? $el.data( 'md-columns' ) : lgColumns,
	    smColumns   = $el.data( 'sm-columns' ) ? $el.data( 'sm-columns' ) : mdColumns,
	    xsColumns   = $el.data( 'xs-columns' ) ? $el.data( 'xs-columns' ) : smColumns;

	if ( windowWidth >= 1200 ) {
		$column = lgColumns;
	} else if ( windowWidth >= 992 ) {
		$column = mdColumns;
	} else if ( windowWidth >= 641 ) {
		$column = smColumns;
	} else {
		$column = xsColumns;
	}

	var $totalGutter = (
		                   $column - 1
	                   ) * $gutter;

	var $columnWidth = (
		                   $gridWidth - $totalGutter
	                   ) / $column;

	$columnWidth = Math.floor( $columnWidth );

	var $columnWidth2 = $columnWidth;
	if ( $column > 1 ) {
		$columnWidth2 = $columnWidth * 2 + $gutter;
	}

	$grid.children( '.grid-sizer' )
	     .css( {
		     'width': $columnWidth + 'px'
	     } );

	var $columnHeight  = $columnWidth,
	    $columnHeight2 = $columnHeight,
	    ratio          = $el.data( 'grid-ratio' );

	if ( ratio ) {
		var res    = ratio.split( ':' ),
		    ratioW = parseFloat( res[ 0 ] ),
		    ratioH = parseFloat( res[ 1 ] );

		$columnHeight = (
			                $columnWidth * ratioH
		                ) / ratioW;

		$columnHeight = Math.floor( $columnHeight );

		if ( $column > 1 ) {
			$columnHeight2 = $columnHeight * 2 + $gutter;
		} else {
			$columnHeight2 = $columnHeight;
		}
	}

	$grid.children( '.grid-item' ).each( function() {
		if ( $( this ).data( 'width' ) == '2' ) {
			$( this ).css( {
				'width': $columnWidth2 + 'px'
			} );
		} else {
			$( this ).css( {
				'width': $columnWidth + 'px'
			} );
		}
		if ( ratio ) {
			if ( $( this ).data( 'height' ) == '2' ) {
				$( this ).css( {
					'height': $columnHeight2 + 'px'
				} );
			} else {
				$( this ).css( {
					'height': $columnHeight + 'px'
				} );
			}
		}
	} );

	if ( $isotopeOptions ) {
		$grid.isotope( 'layout', $isotopeOptions );
	}
}

/**
 * Load post infinity from db.
 */
function insightInfiniteQuery( $wrapper, $grid, reset ) {
	var loader = $wrapper.children( '.tm-grid-pagination' )
	                     .find( '.tm-grid-loader' );
	loader.css( {
		'display': 'inline-block'
	} );

	setTimeout( function() {
		var $queryInput = $wrapper.find( '.tm-grid-query' )
		                          .first(),
		    query       = jQuery.parseJSON( $queryInput.val() ),
		    _data       = $.param( query );

		$.ajax( {
			url: $insight.ajaxurl,
			type: 'POST',
			data: _data,
			dataType: 'json',
			success: function( results ) {

				if ( results.max_num_pages ) {
					query.max_num_pages = results.max_num_pages;
				}

				if ( results.count ) {
					query.count = results.count;
				}

				$queryInput.val( JSON.stringify( query ) );

				var html = results.template;
				var $items = $( html );

				if ( reset == true ) {
					$grid.children( '.grid-item' ).remove();
				}

				if ( $wrapper.data( 'type' ) == 'masonry' ) {

					$grid.isotope()
					     .append( $items )
					     .isotope( 'appended', $items )
					     .imagesLoaded()
					     .always( function() {
						     $grid.isotope( 'layout' );
						     // Re run match height for all items.
						     if ( $wrapper.data( 'match-height' ) ) {
							     $grid.children( '.grid-item' ).matchHeight();
						     }
						     $( document ).trigger( 'insightGridUpdate', [ $wrapper, $grid, $items ] );
					     } );

					insightGridFilterCount( $wrapper, $grid );
					insightGridMasonryCalculateSize( $wrapper, $grid );
				} else if ( $wrapper.data( 'type' ) == 'swiper' ) {
					var $slider = $wrapper.find( '.swiper-container' )[ 0 ].swiper;
					$slider.appendSlide( $items );
					$slider.update();
				} else if ( $wrapper.data( 'type' ) == 'justified' ) {
					$grid.append( html );
					$grid.justifiedGallery( 'norewind' );
				} else {
					$grid.append( $items );
					insightGridFilterCount( $wrapper, $grid );
				}

				insightInitGridAnimation( $grid, $items );
				insightInitGalleryForNewItems( $grid, $items );
				insightInitPopupForNewItems( $grid, $items );
				insightHidePaginationIfEnd( $wrapper, query );

				if ( $wrapper.hasClass( 'case-study-overlay-parallax' ) ) {
					initGridTiltEffect( $wrapper, $items );
				}

				loader.hide();
			}
		} );
	}, 500 );
}

/**
 * Init slider if grid item has post gallery format
 *
 * @param $grid
 * @param $items
 */
function insightInitGalleryForNewItems( $grid, $items ) {
	if ( $grid.data( 'grid-has-gallery' ) == true ) {
		$items.each( function() {
			if ( $( this )
				.hasClass( 'format-gallery' ) ) {
				var $slider = $( this )
					.children( '.post-gallery' );
				insightInitSwiper( $slider );
			}
		} );
	}
}

/**
 * Init popup video if grid item has post video format
 *
 * @param $grid
 * @param $items
 */
function insightInitPopupForNewItems( $grid, $items ) {
	if ( $grid.data( 'grid-has-popup-video' ) == '1' ) {
		$items.each( function() {
			var $popup = $( this ).find( '.tm-popup-video' ).first();
			if ( $popup.length > 0 ) {
				handlerPopupVideo( $popup );
			}
		} );
	}
}

/**
 * Remove pagination if has no posts anymore
 *
 * @param $el
 * @param query
 *
 */
function insightHidePaginationIfEnd( $el, query ) {
	if ( query.found_posts <= (
		query.paged * query.posts_per_page
	) ) {

		if ( $el.data( 'pagination' ) === 'loadmore_alt' ) {
			var loadMoreBtn = $( $el.data( 'pagination-custom-button-id' ) );

			loadMoreBtn.hide();
		} else {
			$el.children( '.tm-grid-pagination' ).hide();
		}

		$el.children( '.tm-grid-messages' ).show( 1 );
		setTimeout( function() {
			$el.children( '.tm-grid-messages' ).remove();
		}, 5000 );
	} else {
		if ( $el.data( 'pagination' ) === 'loadmore_alt' ) {
			var loadMoreBtn = $( $el.data( 'pagination-custom-button-id' ) );

			loadMoreBtn.show();
		} else {
			$el.children( '.tm-grid-pagination' ).show();
			$el.children( '.tm-grid-pagination' ).find( '.tm-grid-loadmore-btn' ).show();
		}

	}
}

/**
 * Update counter for grid filters
 *
 * @param $el
 * @param $grid
 */
function insightGridFilterCount( $el, $grid ) {
	if ( $el.children( '.tm-filter-button-group' ).data( 'filter-counter' ) != true ) {
		return;
	}

	var $gridItems = $grid.children( '.grid-item' );
	var $gridTotal = $gridItems.length;
	var filterType = $el.data( 'filter-type' );

	if ( filterType === 'ajax' ) {
		$el.find( '.btn-filter' ).each( function() {
			var count = $( this ).data( 'filter-count' );

			if ( $( this ).children( '.filter-counter' ).length > 0 ) {
				$( this ).children( '.filter-counter' ).text( count );
			} else {
				$( this ).append( '<span class="filter-counter">' + count + '</span>' );
			}
		} );
	} else {
		$el.find( '.btn-filter' ).each( function() {
			var filter = $( this ).data( 'filter' );
			var count = 0;
			if ( filter == '*' ) {
				if ( $( this ).children( '.filter-counter' ).length > 0 ) {
					$( this ).children( '.filter-counter' ).text( $gridTotal );
				} else {
					$( this ).append( '<span class="filter-counter">' + $gridTotal + '</span>' );
				}
			} else {
				filter = filter.replace( '.', '' );
				$gridItems.each( function() {
					if ( $( this ).hasClass( filter ) ) {
						count ++;
					}
				} );
				if ( $( this ).children( '.filter-counter' ).length > 0 ) {
					$( this ).children( '.filter-counter' ).text( count );
				} else {
					$( this ).append( '<span class="filter-counter">' + count + '</span>' );
				}
			}
		} );
	}
}

function insightGridFilterHandler( $el, $grid ) {
	$el.children( '.tm-filter-button-group' ).on( 'click', '.btn-filter', function() {
		if ( $( this ).hasClass( 'current' ) ) {
			return;
		}

		if ( $el.data( 'filter-type' ) == 'ajax' ) {
			var filterValue = $( this ).attr( 'data-filter' );

			var $queryInput = $el.find( '.tm-grid-query' ).first();
			var query = jQuery.parseJSON( $queryInput.val() );
			if ( filterValue === '*' ) {
				query.extra_taxonomy = '';
			} else {
				query.extra_taxonomy = $( this ).attr( 'data-ajax-filter' );
			}

			$queryInput.val( JSON.stringify( query ) );

			$( document ).trigger( 'insightGridInfinityLoad', $el );

			$( this ).siblings().removeClass( 'current' );
			$( this ).addClass( 'current' );
		} else {
			var filterValue = $( this ).attr( 'data-filter' );
			if ( $el.data( 'type' ) == 'masonry' ) {
				$grid.children( '.grid-item' ).each( function() {
					$( this ).removeClass( 'animate' );
				} );

				$grid.isotope( {
					filter: filterValue
				} );

				if ( $grid.hasClass( 'has-animation' ) ) {
					$grid.children( '.grid-item:not(.isotope-hidden)' )
					     .each( function() {
						     $( this ).addClass( 'animate' );
					     } );
				}
			} else if ( $el.data( 'type' ) == 'swiper' ) {
				filterValue = filterValue.replace( '.', '' );
				$grid.children( '.grid-item' ).each( function() {
					if ( filterValue == '*' ) {
						$( this ).show();
						$( this ).addClass( 'animate' );
					} else {
						if ( ! $( this ).hasClass( filterValue ) ) {
							$( this ).hide();
						} else {
							$( this ).show();
							$( this ).addClass( 'animate' );
						}
					}
				} );
				var $slider = $el.children( '.mitech-swiper' )
				                 .children( '.swiper-container' )[ 0 ].swiper;
				$slider.update();
				$slider.slideTo( 0 );
			} else if ( $el.data( 'type' ) == 'justified' ) {
				if ( filterValue == '*' ) {
					$grid.justifiedGallery( { filter: false } );
				} else {
					$grid.justifiedGallery( { filter: filterValue } );
				}
			} else {
				$grid.children( '.grid-item' ).hide().removeClass( 'animate' );

				var $filterItems;

				if ( filterValue == '*' ) {
					$filterItems = $grid.children( '.grid-item' );
				} else {
					$filterItems = $grid.children( filterValue );
				}

				$filterItems.show();

				$filterItems.each( function( i, o ) {
					var self = $( this );

					setTimeout( function() {
						self.addClass( 'animate' );
					}, i * 200 );
				} );
			}

			$( this ).siblings().removeClass( 'current' );
			$( this ).addClass( 'current' );
		}
	} );
}

function insightInitGridAnimation( $grid, $items ) {
	if ( ! $body.hasClass( 'page-has-animation' ) || ! $grid.hasClass( 'has-animation' ) ) {
		return;
	}

	var itemQueue  = [],
	    queueDelay = 250,
	    queueTimer;

	$items.vcwaypoint( function() {
		// Fix for different ver of waypoints plugin.
		var _self = this.element ? this.element : $( this );

		itemQueue.push( _self );
		processItemQueue( itemQueue, queueDelay, queueTimer );
		queueDelay += 250;

		queueResetDelay = setTimeout( function() {
			queueDelay = animateQueueDelay;
		}, animateQueueDelay );
	}, {
		offset: '90%',
		triggerOnce: true
	} );
}

function initGridTiltEffect( $el, $items ) {
	if ( $el.data( 'hover' ) !== 'tilt' ) {
		return;
	}

	$items.find( '.post-thumbnail' ).tilt( {
		perspective: 1440,
		scale: 1.06,
		easing: 'cubic-bezier(.03,.98,.52,.99)',
	} );
}

});
