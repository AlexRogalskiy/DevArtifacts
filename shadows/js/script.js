/* Requires Compass!

Shade - The shadow mixin that lets you specify shadow direction by angle 

If you'd like to make this Mixin better, get involved https://github.com/DarbyBrown/Shade

If you don't use compass, you could use the following function:

Created by Jelmer Borst - https://twitter.com/japborst 

$pi: 3.14159265359;

@function pow($base,$exp){
	$value: $base;
	@if $exp > 1{
		@for $i from 2 through $exp{
			$value: $value * $base;
		}
	}
	@if $exp < 1{
		@for $i from 0 through -$exp{
			$value: $value / $base;
		}
	}
	@return $value;
}
@function fact($val){
	$value: 1;
	@if $val > 0{
		@for $i from 1 through $number{
			$value: $value * $i;
		}
	}
}

@function sin($angle, $degrees: false){
	$sin: 0
	@if $degrees{
		$degrees: $degrees / 180 * $pi;
	}
	@for $n from 1 through 10{
		$sin: $sin + ( pow(-1,n) / fact(2n+1) ) * pow($angle,(2n+1));
	}
	@return $sin;
}
@function cos($angle, $degrees: false){
	$cos: 0
	@if $degrees{
		$degrees: $degrees / 180 * $pi;
	}
	@for $n from 1 through 10{
		$cos: $cos + ( pow(-1,n) / fact(2n) ) * pow($angle,2n);
	}
	@return $cos;
}

*/


