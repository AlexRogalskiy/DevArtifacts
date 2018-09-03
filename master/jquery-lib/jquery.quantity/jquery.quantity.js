/**
 * Quantity
 * ...
 *
 * Dual licensed under the MIT and GPL licenses.
 * Copyright (c) 2013 Maxim Timokhin
 * @name     Quantity
 * @author   Maxim Timokhin (m.v.timokhin@gmail.com)
 */

(function ($) {

    var Quantity = function (element, options) {
        this.container = $('<div class="quantity-container"><span class="minus">-</span><input type="text" class="value" pattern="[0-9]*" value="0" maxlength="5" max="99999"><span class="plus">+</span></div>');
        this.el = $(element);
        this.init(options);
    };

    Quantity.prototype = {
        init: function (options) {
            var that = this;

            that.el.after(that.container);
            that.el.attr('type', 'hidden');

            that.options = $.extend({}, that.defaults, options);
            that.oldval = that.el.val();
            that.curval = that.el.val();
            $(this.options.value, this.container).val(this.curval);

            that.options.minValue = that.el.attr('min') || that.options.minValue;
            that.options.maxValue = that.el.attr('max') || that.options.maxValue;

            that.container.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

            that.container.find(that.options.plus).on('click', function (e) {
                if (parseInt(that.curval) < that.options.maxValue) {
                    that.curval++;
                    that.refresh();
                }
                e.preventDefault();
                return true;
            });

            that.container.find(that.options.minus).on('click', function (e) {
                if (parseInt(that.curval) > that.options.minValue) {
                    that.curval--;
                    that.refresh();
                }
                e.preventDefault();
                return true;
            });

            that.el.on('qty:change', function () {
                that.curval = that.el.val();
                that.refresh();
            });

            var holdTimeout, holdTimer;
            that.container.find(that.options.plus).on('mousedown', function (e) {
                holdTimeout = setTimeout(function () {
                    holdTimer = setInterval(function () {
                        if (parseInt(that.curval) >= that.options.maxValue) {
                            clearInterval(holdTimer);
                            return false;
                        }
                        that.curval++;
                        that.refresh();
                    }, 100);
                }, 500);
            });
            that.container.find(that.options.minus).on('mousedown', function (e) {
                holdTimeout = setTimeout(function () {
                    holdTimer = setInterval(function () {
                        if (that.curval <= that.options.minValue) {
                            clearInterval(holdTimer);
                            return false;
                        }
                        that.curval--;
                        that.refresh();
                    }, 100);
                }, 500);
            });

            $('body').on('mouseup', function (e) {
                clearInterval(holdTimeout);
                clearInterval(holdTimer);
            });


            $(this.options.value, this.container).on('keyup', function () {
                var val = $(this).val().replace(/[^\d+]/g, '');
                if (!val.length || val <= 0) val = 1;
                else if(val >  that.options.maxValue) val = that.options.maxValue;
                that.curval = val;
                $(this).val(val);
                that.refresh();
            });

            that.refresh();
        },

        refresh: function () {
            if (this.oldval != this.curval) {
                $(this.options.value, this.container).val(this.curval);
                this.container.trigger('change', [this.curval]);
                this.el.val(this.curval);
                this.el.trigger('change');
                this.oldval = this.curval;
            }
        },

        value: function () {
            return this.curval;
        }
    };

    Quantity.prototype.defaults = {
        current: 1,
        minValue: 1,
        maxValue: 200,
        plus: '.plus',
        minus: '.minus',
        value: '.value'
    };

    $.fn.Quantity = function (options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this)
                , data = $this.data('Quantity');
            if (!data) $this.data('Quantity', (data = new Quantity(this, options)));
            if (typeof options == 'string') return data[options].apply(data, args);
        })
    };

    // $(function () {
    //     $('input.quantity').Quantity();
    // });

})(jQuery);