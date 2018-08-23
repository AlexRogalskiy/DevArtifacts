"use strict";

import ReactDOM from 'react-dom';

/**
 *  returns the failed constraints { errors: [] } or true if valid
 *  constraints are a map of supported constraint names and values
 *  validators return true if valid, false otherwise
 */
export function validate (val, constraints) {
	var errors = [];
	var validators = {
		minlength: {
			fn: function (val, cVal) {
				return typeof val === 'string' && val.length >= cVal;
			},
			msg: function (val, cVal) {
				return 'minimum ' + cVal + ' characters';
			}
		},
		required: {
			fn: function (val) {
				return typeof val === 'string' ? 
					!/^\s*$/.test(val) : val !== undefined && val !== null;
			},
			msg: function () {
				return 'required field';
			}
		},
		exclusive: {
			fn: function (val, list) {
				if (!(list instanceof Array)) { return false; }
				return list.filter(function (v) { return v === val; }) < 1;
			},
			msg: function (val) {
				return val + ' is already taken';
			}
		}
	};

	if (!constraints || typeof constraints !== 'object') {
		return true;
	}

	// exercise each constraint
	for (let constraint in constraints) {
		let validator, currentConstraint;

		if (
			constraints.hasOwnProperty(constraint) && 
			validators.hasOwnProperty(constraint.toLowerCase())
		) {
			validator         = validators[constraint.toLowerCase()];
			currentConstraint = constraints[constraint];

			if (!validator.fn(val, currentConstraint)) {
				errors.push({
					constraint: constraint, // the failed constraint
					msg: validator.msg(val, currentConstraint)
				});
			};
		}
	}

	return errors.length > 0 ? {errors: errors} : true;
}

/**
 * get input element by ref to Basic Input or input name attr
 * USE AS MIXIN
 */
export var formMixins = { 
	getInputEle: function (ref) {
		if (!this.isMounted()) { return; }
		return this.refs[ref] ? 
			ReactDOM.findDOMNode(this.refs[ref]).querySelector('input') : 
			ReactDOM.findDOMNode(this).querySelector('[name='+ref+'] input'); 
	},
	validateField: function (fieldName, constraintOverride) {
		let fieldVal = this.getInputEle(fieldName).value
		,   currentConstraint
		,   errors
		;

		if (fieldName in this.constraints) {
			currentConstraint = constraintOverride || this.constraints[fieldName];
			errors = validate(fieldVal, currentConstraint);
			return !!errors.errors ? errors.errors : false;
		} else {
			return true;
		}
	}
};
 
