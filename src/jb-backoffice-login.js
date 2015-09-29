/**
* Adds distributed calls to image upload/list component
*/
( function() {

	'use strict';

	angular
	

	.module( 'jb.backofficeLogin', [ 'jb.user', 'jb.session' ] )

	/**
	* <input data-backoffice-image-component 
	*	data-for=\'enity\'>
	*/
	.directive( 'backofficeLoginComponent', [ function() {

		return {
			require				: [ 'backofficeLoginComponent' ]
			, controller		: 'BackofficeLoginComponentController'
			, controllerAs		: 'backofficeLoginComponent'
			, bindToController	: true
			, link				: function( scope, element, attrs, ctrl ) {
				ctrl[ 0 ].init( element, ctrl[ 1 ] );
			}
			, templateUrl		: 'backofficeLoginComponentTemplate.html'
			, scope: {
				// Function that is called after successful login
				'afterLoginCallback'		: '&'
				// Where to get the current app's languages from. Needed to display locale component.
				, 'languageEndpoint'		: '@'
			}

		};

	} ] )

	.controller( 'BackofficeLoginComponentController', [ '$scope', '$state', '$q', 'UserService', 'SessionService', 'APIWrapperService', function( $scope, $state, $q, UserService, SessionService, APIWrapperService ) {

		var self = this
			, _element;

		self.userName = undefined;
		self.password = undefined;

		/**
		* Error, if an error happened. If self.status.message is set, it's displayed to the user (as a danger). 
		* true if logged in
		* undefined, if no login has been attempted.
		*/
		self.status = undefined;

		self.init = function( el ) {
			_element = el;
		};

		self.login = function() {
			
			UserService
				.login( self.userName, self.password )
				.then( function() {

					APIWrapperService.setDefaultHeader( 'Authorization', 'ee-simple ' + SessionService.get( 'accessToken' ) );
					return true;

				} )
				.then( self.getAppLanguages() )
				.then( function() {

					$state.go( '/' );

				}, function( err ) {
					self.status = err;
				} );

		};

		self.getAppLanguages = function() {

			if( !self.languageEndpoint ) {
				console.warn( 'BackofficeLoginComponentController: langugaeEndpoint not set' );
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			}

			return APIWrapperService.request( {
				method				: 'GET'
				, url				: self.languageEndpoint
				, headers			: {
					select			: '*,language.*'
				}
			} )
			.then( function( data ) {
				console.log( 'BackofficeLoginComponentController: Set supported-languages to %o', data );
				SessionService.set( 'supported-languages', data, 'local' );
				return true;
			}, function( err ) {
				console.error( 'BackofficeLoginComponentController: %o', err );
				return $q.reject( err );
			} );

		};

	} ] )

	.run( [ '$templateCache', function( $templateCache ) {

		$templateCache.put( 'backofficeLoginComponentTemplate.html', 

			'<div class=\'container\'>' +
				'<form class=\'form-signin\'>' +
					'<h2 class=\'form-signin-heading\'>Please sign in</h2>' +
					'<p class=\'bg-danger text-danger error-message\' data-ng-if=\'!!backofficeLoginComponent.status.message\'>{{ backofficeLoginComponent.status.message }}</p>' +
					'<label for=\'login-form-email\' class=\'sr-only\'>Email address</label>' +
					'<input type=\'email\' id=\'login-form-email\' class=\'form-control\' placeholder=\'Email address\' required autofocus data-ng-model=\'backofficeLoginComponent.userName\'>' +
					'<label for=\'login-form-password\' class=\'sr-only\'>Password</label>' +
					'<input type=\'password\' id=\'login-form-password\' class=\'form-control\' placeholder=\'Password\' required data-ng-model=\'backofficeLoginComponent.password\'>' +
					//'<div class=\'checkbox\'>' +
					//	'<label>' +
					//		'<input type=\'checkbox\' value=\'remember-me\'> Remember me' +
					//	'</label>' +
					//'</div>' +
					'<button class=\'btn btn-lg btn-primary btn-block\' type=\'submit\' data-ng-click=\'backofficeLoginComponent.login()\'>Sign in</button>' +
				'</form>' +
			'</div>'

		);

	} ] );


} )();

