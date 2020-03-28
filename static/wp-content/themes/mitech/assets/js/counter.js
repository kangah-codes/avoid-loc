jQuery( document ).ready( function( $ ) {
	'use strict';

	$( '.tm-counter' ).vcwaypoint( function() {
		var self = this.element ? this.element : this;
		var $el = $( self );

		if ( ! $el.hasClass( 'has-animation' ) ) {
			return;
		}
		var $numbers = $el.find( '.number' );
		var number = $numbers.html();

		var animation = $el.data( 'animation' ) ? $el.data( 'animation' ) : 'counterUp';

		if ( animation === 'odometer' ) {
			var od = new Odometer( {
				el: $numbers[ 0 ],
				value: 0,
				format: '',
			} );
			od.render();
			od.update( number );
		} else {
			$numbers.countTo( {
				from: 0,
				to: number
			} );
		}
		this.destroy(); // trigger once.
	}, {
		offset: '90%',
	} );
} );
