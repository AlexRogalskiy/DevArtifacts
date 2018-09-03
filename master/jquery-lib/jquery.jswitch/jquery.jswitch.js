/**
 * Beautiful switch control for jQuery
 *
 * Dual licensed under the MIT and GPL licenses.
 * Copyright (c) 2013 Maxim Timokhin
 * @name     jSwitch
 * @author   Maxim Timokhin (m.v.timokhin@gmail.com)
 * @example  $("input:check").jSwitch();
 * @example  $("input:check").jSwitch('switchOn');
 * @example  $("input:check").jSwitch('switchOff');
 * @example  $("input:check").jSwitch('switchToggle');
 *
 *
 * Options:
 * theme: red, blue, purple, gray, yellow, orange
 */
(function ($) {

    var Switch = function (element, options) {
        this.$input = $(element);
        this.init(options);
    };

    Switch.prototype = {
        init: function (options) {
            this.options = $.extend({}, this.defaults, options);
            this.options.theme = this.$input.data('theme') || this.options.theme;

            this.$el = $('<div/>', {class: 'jswitch-control ' + this.options.theme});
            this.$point = $('<i/>', {class: 'jswitch-handler'});
            this.$el.append(this.$point);
            this.controlWidth = 43;
            this.handlerWidth = 23;
            this.mouseDown = false;


            this.$input
                .hide()
                .before(this.$el);

            this.$el.attr('unselectable', 'on')
                .css('user-select', 'none')
                .on('selectstart', false);

            if (this.$input.is(':checked')) this.switchOn();

            this.bindEvents();
        },

        bindEvents: function () {

            var that = this;

            that.$point.on('touchmove mousemove', function (e) {
                if (that.mouseDown) {
                    var event = e.originalEvent.touches ? e.originalEvent.touches[0] : e.originalEvent;
                    var pos = event.pageX - that.$el.offset().left - that.handlerWidth / 2
                    if (pos < 0) pos = 0;
                    if ((pos + that.handlerWidth) > that.controlWidth) pos = that.controlWidth - that.handlerWidth;
                    that.$point.css({marginLeft: pos + 'px'});
                    e.preventDefault();
                }
            });

            that.$point.on('mousedown touchstart', function (e) {
                that.mouseDown = true;
                e.preventDefault();
            });

            $(document).on('mouseup touchend', function (e) {
                that.mouseDown = false;
                var posCurrent = parseInt(that.$point.css('margin-left'), 10);

                if ((posCurrent + that.handlerWidth / 2) > that.controlWidth / 2) {
                    that.switchOn();
                } else {
                    that.switchOff();
                }
                //e.preventDefault();
            });

            that.$el.on('click', function (e) {
                //if ($(e.target).hasClass('jswitch-handler')) return false;
                that.switchToggle();
                e.preventDefault();
            });

        },
        switchOn: function () {
            var that = this;
            this.$point.stop().animate({marginLeft: that.controlWidth - that.handlerWidth - 1}, 50, function () {
                that.$el.trigger('switchOn');
                that.$el.addClass('on');
                that.$input.attr('checked', true).trigger('change');
            });
        },
        switchOff: function () {
            var that = this;
            this.$point.stop().animate({marginLeft: 1}, 50, function () {
                that.$el.trigger('switchOff');
                that.$el.removeClass('on');
                that.$input.attr('checked', false).trigger('change');
            });
        },
        switchToggle: function () {
            if (this.$input.attr('checked')) {
                this.switchOff();
            } else {
                this.switchOn();
            }
        }
    }


    Switch.prototype.defaults = {
        theme: "default"
    };

    $.fn.jSwitch = function (options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this)
                , data = $this.data('jSwitch')
            if (!data) $this.data('jSwitch', (data = new Switch(this, options)))
            if (typeof options == 'string') data[options].apply(data, args)
        })

    }

})(jQuery)