jQuery( document ).ready( function ( $ ) {
    'use strict';

    $( '.tm-countdown' ).each( function () {
        var $countdown = $( this ).children( '.countdown' );
        var settings   = $countdown.data();

        var animation   = settings.animation ? settings.animation : '';
        var daysText    = settings.daysText;
        var hoursText   = settings.hoursText;
        var minutesText = settings.minutesText;
        var secondsText = settings.secondsText;

        if ( animation === 'time-circle' ) {
            var circleBg  = settings.circleBackground ? settings.circleBackground : 'rgba(0, 0, 0, 0.3)';
            var timeBg    = $countdown.data( 'time-color' );
            var daysBg    = settings.daysBg ? settings.daysBg : timeBg;
            var hoursBg   = settings.hoursBg ? settings.hoursBg : timeBg;
            var minutesBg = settings.minutesBg ? settings.minutesBg : timeBg;
            var secondsBg = settings.secondsBg ? settings.secondsBg : timeBg;


            $countdown.TimeCircles( {
                circle_bg_color: circleBg,
                fg_width: 0.02,
                bg_width: 1,
                direction: 'Clockwise',
                time: {
                    Days: {
                        text: daysText,
                        color: daysBg
                    },
                    Hours: {
                        text: hoursText,
                        color: hoursBg
                    },
                    Minutes: {
                        text: minutesText,
                        color: minutesBg
                    },
                    Seconds: {
                        text: secondsText,
                        color: secondsBg
                    }
                }
            } );

            $( window ).on( 'resize', function () {
                $countdown.TimeCircles().rebuild();
            } );
        } else if ( animation === 'flip' ) {
            var date = (
                           (
                               new Date( settings.date ).getTime()
                           ) / 1000
                       ) - (
                           (
                               new Date().getTime()
                           ) / 1000
                       );
            date     = Math.max( 1, date );

            var clock = $countdown.FlipClock( date, {
                clockFace: 'DailyCounter',
                countdown: true
            } );

            $countdown.children( '.flip-clock-divider' ).each( function () {
                var flip1 = $( this ).next();
                var flip2 = $( this ).next().next();
                var label = $( this ).children( '.flip-clock-label' );

                var wrap = $( '<div class="flip-time-wrap"></div>' ).insertAfter( $( this ) );

                wrap.append( flip1 ).append( flip2 ).append( label );
            } );
        } else {
            $countdown.countdown( settings.date, function ( event ) {
                $( this )
                    .html( event.strftime( '' + '<div class="countdown-wrap">' + '<div class="day">' + '<span class="number">%D</span>' + '<span class="text">' + daysText + '</span>' + '</div>' + '<div class="hour">' + '<span class="number">%H</span>' + '<span class="text">' + hoursText + '</span>' + '</div>' + '<div class="minute">' + '<span class="number">%M</span>' + '<span class="text">' + minutesText + '</span>' + '</div>' + '<div class="second">' + '<span class="number">%S</span>' + '<span class="text">' + secondsText + '</span>' + '</div>' + '</div>' ) );
            } );
        }
    } );
} );
