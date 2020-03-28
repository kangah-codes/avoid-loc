jQuery( document ).ready( function( $ ) {
	'use strict';

	var font = $( 'body' ).data( 'font' );

	Chart.defaults.global.defaultFontFamily = font;
	Chart.defaults.global.defaultFontSize = 15;
	Chart.defaults.global.defaultFontColor = '#222';

	$( '.tm-js-chart' ).vcwaypoint( function() {
		var self = this.element ? this.element : this;
		var $el = $( self );

		var settings = $el.data();
		var legendEnable = settings.legendEnable && settings.legendEnable == '1' ? true : false;
		var legendClickable = settings.legendClickable && settings.legendClickable == '1' ? true : false;

		var dataString = $el.find( '.chart-data' ).html();
		var data = false;
		try {
			data = JSON.parse( dataString );
		} catch ( ex ) {
		}
		if ( data ) {
			var $canvas = $el.find( 'canvas' );

			var chart = new Chart( $canvas, data );

			if ( data.type === 'pie' && legendEnable ) {
				var chartLegends = $el.find( '.chart-legends' );

				chartLegends.html( chart.generateLegend() );

				if ( legendClickable ) {
					chartLegends.find( 'li' ).each( function() {
						$( this ).on( 'click', legendClickCallback );
					} );
				}
			}
		}

		this.destroy();
	}, {
		offset: '90%',
	} );

	function legendClickCallback( event ) {
		event = event || window.event;

		var target = event.target || event.srcElement;
		while ( target.nodeName !== 'LI' ) {
			target = target.parentElement;
		}
		var parent = target.parentElement;
		var chartId = parseInt( parent.classList[ 0 ].split( "-" )[ 0 ], 10 );
		var chart = Chart.instances[ chartId ];
		var index = Array.prototype.slice.call( parent.children ).indexOf( target );
		var meta = chart.getDatasetMeta( 0 );
		var item = meta.data[ index ];

		if ( item.hidden === null || item.hidden === false ) {
			item.hidden = true;
			target.classList.add( 'hidden' );
		} else {
			target.classList.remove( 'hidden' );
			item.hidden = null;
		}
		chart.update();
	}
} );
