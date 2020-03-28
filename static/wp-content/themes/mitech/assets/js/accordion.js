jQuery( document ).ready( function( $ ) {
	'use strict';

	$( '.accordion-title-wrapper' ).on( 'click', function( e ) {
		e = e || window.event;
		e.preventDefault();
		var section = $( this ).parent( '.accordion-section' );
		if ( section.hasClass( 'active' ) ) {
			section.removeClass( 'active' );
			$( this ).siblings( '.accordion-content' ).slideUp( 300 );
		} else {
			var parent = $( this ).parents( '.tm-accordion' ).first();
			if ( ! parent.data( 'multi-open' ) ) {
				parent.children( '.active' )
				      .removeClass( 'active' )
				      .children( '.accordion-content' )
				      .slideUp( 300 );
			}
			section.addClass( 'active' );
			section.children( '.accordion-content' ).slideDown( 300 );
		}
	} );
} );
