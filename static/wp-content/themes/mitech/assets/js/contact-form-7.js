(
	function( $ ) {
		'use strict';

		$( document ).ready( function() {
			$( '.tm-contact-form-7' ).each( function() {
				var $el = $( this );

				$( this ).find( 'form' ).on( 'submit', function() {
					$el.children( '.tm-form-loading' ).show();
				} );
			} );
		} );

		document.addEventListener( 'wpcf7submit', function( event ) {
			var parent = $( event.target ).parents( '.tm-contact-form-7' ).first();

			parent.children( '.tm-form-loading' ).hide();
		}, false );

	}( jQuery )
);
