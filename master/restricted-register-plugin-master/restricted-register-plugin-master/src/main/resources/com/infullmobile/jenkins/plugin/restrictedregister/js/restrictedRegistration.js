function rrUrlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};

function rrEnableButton(buttonID) {
    jQuery(buttonID).removeClass('disabled');
};

function rrDisableButton(buttonID) {
    jQuery(buttonID).addClass('disabled');
    jQuery(buttonID).blur();
};

function rrIsButtonEnabled(buttonID) {
    return !jQuery(buttonID).hasClass('disabled');
};

function rrSerializeForm(formID) {
    var fields = jQuery(formID).serializeArray();

    var values = {};
    jQuery.each(fields, function(i, field) {
        values[field.name] = field.value;
    });
    return values;
};

function rrIsAnyRequiredFormFieldEmpty() {
    var anyValueEmpty = false;
    jQuery('.rr_required').each(function(index, value) {
        value = jQuery(this).val();
        if (value === "") {
            anyValueEmpty = true;
            jQuery(this).addClass('rr_input_error');
        }
    });
    return anyValueEmpty;
};

function rrClearFormErrors() {
    jQuery('.rr_form').find('input').each(function(index, value) {
        jQuery(this).removeClass('rr_input_error');
    });
};