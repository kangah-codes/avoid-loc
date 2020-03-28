jQuery( function( $ ) {
	'use strict';

	$( '.tm-circle-progress-chart' ).vcwaypoint( function() {
		// Fix for different ver of waypoints plugin.
		var self = this.element ? this.element : this;
		var $el = $( self );

		var countHtml = $el.find( '.chart-number' );

		var chart = $el.find( '.chart' ).circleProgress( {
			startAngle: - Math.PI / 4 * 2,
			animation: { duration: 1700 }
		} );

		if ( $el.data( 'use-number' ) == '1' ) {
			chart.on( 'circle-animation-progress', function( event, progress ) {
				countHtml.html( parseInt( (
					                          countHtml.data( 'max' )
				                          ) * progress ) + '<span>' + countHtml.data( 'units' ) + '</span>' );

			} );
		}

		this.destroy(); // Trigger once.
	}, {
		offset: '90%',
	} );
} );
