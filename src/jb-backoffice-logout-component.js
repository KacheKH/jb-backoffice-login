/** Logout button for the joinbox distributed back office */

( function() {

	'use strict';

	angular
	.module( 'jb.backofficeLogin' )
	.directive( 'backofficeLogoutComponent', [ 'UserService', function( UserService ) {

		return {
			link: function( scope, element ) {
				
				element.click( function() {

					scope.$apply( function() {

						console.log( 'backofficeLogoutComponent: Logout user' );

						UserService.logout()
							.then( function() {
								// Do a simple reload – don't depend on $state, as it's reload() method doesn't
								// really exist.
								window.location.reload();
							}, function() {
								// accessToken could not be removed from server. So what.
								// TBD: Error handling
								window.location.reload();
							} );

					} );

				} );

			}
		};

	} ] );

} )();
