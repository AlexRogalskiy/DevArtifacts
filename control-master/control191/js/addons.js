/**
 * Checks the strength of a password.
 * Returns  on empty input string, -2 on weak password, 0 on medium strength password or 1 on strong password.
 * @param passwordToCheck string
 * @return integer

Created By Rashid for Web developer juice
 */

		
		function passwordStrength( pwd ) {
			var strongRegex = new RegExp( "^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$", "g" );
			var mediumRegex = new RegExp( "^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g" );
			var enoughRegex = new RegExp( "(?=.{6,}).*", "g" );

			if (pwd.length == 0) {
				return 'Type Password';
			} else if( false == enoughRegex.test( pwd ) ) {
				return 'Short';
			} else if( strongRegex.test( pwd ) ) {
				return 'Strong';
			} else if( mediumRegex.test( pwd ) ) {
				return 'Medium';
			} else {
				return 'Weak';
			}
		}

			function isNumeric( thisString ) {
				return !isNaN( thisString );
			}

			function isAlphaNumeric( thisString ) {
				if( val.match( /^[a-zA-Z0-9]+$/ ) ) {
					return true;
				} else {
					return false;
				}
			}

			function hasAlphabets( thisString ) {
				if( thisString.match( /^[a-zA-Z]+$/ ) ) {
					return true;
				} else {
					return false;
				}
			}

			function isValidEmailAddress( thisString ) {
				if( thisString.match( /^([a-zA-Z0-9])+([.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)+/ ) ) {
					return true;
				} else {
					return false;
				}
			}

			String.prototype.trim = String.prototype.trim ? String.prototype.trim : function() {
				var tempStr = this;
				while( tempStr.charAt( 0 ) == ' ' || tempStr.charAt( 0 ) == 'n' || tempStr.charAt( 0 ) == '\t' || tempStr.charAt( 0 ) == '\r' ) {
					tempStr = tempStr.substring( 1 );
				}
				while( tempStr.charAt( tempStr.length - 1 ) == ' ' || tempStr.charAt( tempStr.length - 1 ) == 'n' || tempStr.charAt( tempStr.length - 1 ) == '\t' || tempStr.charAt( tempStr.length - 1 ) == '\r' ) {
					tempStr = tempStr.substring( 0, tempStr.length - 1 );
				}
				return tempStr;
			};
