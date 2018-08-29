App.ScreenCanvasComponent = Ember.Component.extend({
    tagName: "canvas",
    attributeBindings: ['width','height'],
    classNames: ['screen-canvas'],
    routerBinding: 'controller.target',
    uiControlTypes: [
        'container',
        'button',
        'label',
        'editText',
        'spinner',
        'switch',
        'slider',
        'webView',
        'imageView',
        'videoView',
        'audioPlayer',
        'listView',
        'gridView',
        'photocameraController',
        'videocameraController',
        'audioRecorder',
        'map',
        'datepicker',
        'timepicker',
        'card'
    ],
    ctx: null,

    device: function() {
        return this.get('viewControllerToShow.application.device');
    }.property('viewControllerToShow.application.device'),

    width: function() {
        return this.get('device.screenWidth');
    }.property('device.screenWidth'),

    height: function() {
        return this.get('device.screenHeight');
    }.property('device.screenHeight'),

    uiPhoneControlsToDraw: function() {
        var controls = [];
        if(this.get('viewControllerToShow')) {
            this.get('viewControllerToShow.uiPhoneControls').forEach(function(upc) {
                controls.pushObject(upc);
            });
            this.get('viewControllerToShow.uiPhoneControls').forEach(function(upc) {
                if((upc.constructor.toString() === 'App.Container') && upc.get('childViewController')) {
                    upc.get('childViewController.uiPhoneControls').forEach(function(c) {
                        controls.pushObject(c);
                    });
                }
            });
        }
        return controls;
    }.property(
        'viewControllerToShow.uiPhoneControls.[]',
        'viewControllerToShow.uiPhoneControls.@each.childViewController.uiPhoneControls.[]'
    ),

    didInsertElement: function() {
        this.set('ctx', this.get('element').getContext('2d'));
        this.clear();
    },

    onSomethingSelected: function() {
        var path = this.get('router.location.lastSetURL');
        var self = this;
        if(path) {
            var splittedPath = path.split('/');
            var selectedType = splittedPath[splittedPath.get('length') - 2];
            var selectedId = splittedPath.get('lastObject');
            if(this.get('uiControlTypes').find(function(type) {return type === selectedType;}) !== undefined) {
                this.clear();
                this.drawAllConstraints(selectedId);
            } else {
                this.clear();
            }
        } else {
            this.clear();
        }
    }.observes(
        'router.location.lastSetURL',
        'uiPhoneControlsToDraw.@each.isWidthConstrained',
        'uiPhoneControlsToDraw.@each.isHeightConstrained',
        'uiPhoneControlsToDraw.@each.isRatioConstrained',
        'uiPhoneControlsToDraw.@each.posX',
        'uiPhoneControlsToDraw.@each.posY',
        'uiPhoneControlsToDraw.@each.width',
        'uiPhoneControlsToDraw.@each.height',
        'uiPhoneControlsToDraw.@each.ratioWidth',
        'uiPhoneControlsToDraw.@each.ratioHeight',
        'uiPhoneControlsToDraw.@each.weightInChain',
        'uiPhoneControlsToDraw.@each.marginTop',
        'uiPhoneControlsToDraw.@each.marginBottom',
        'uiPhoneControlsToDraw.@each.marginStart',
        'uiPhoneControlsToDraw.@each.marginEnd',
        'uiPhoneControlsToDraw.@each.controlChain'
    ).on('init'),

    drawAllConstraints: function(id) {
        var self = this;
        var controls = this.get('uiPhoneControlsToDraw');
        if(controls) {
            var control = controls.find(function(control) {return control.get('id') === id});
            if(control) {
                var constraints = control.get('constraints').filter(function(c) {
                    return c.get('valid') && ((!c.get('isDirty') || c.get('isSaving')));
                });

                // Draw position constraints
                if(constraints) {
                    constraints.forEach(function(constraint) {
                        self.drawConstraint(constraint, control);
                    });
                }

                var ctx = self.get('ctx');
                if(ctx) {
                    // Draw dimension constraints
                    ctx.fillStyle = "#ff0000";
                    if(control.get('isWidthConstrained') || control.get('isWidthPercentConstrained')) {
                        ctx.fillRect(control.get('start'), control.get('top') - 2, control.get('computedWidth'), 2);
                        ctx.fillRect(control.get('start'), control.get('bottom'), control.get('computedWidth'), 2);
                    }
                    if(control.get('isHeightConstrained') || control.get('isHeightPercentConstrained')) {
                        ctx.fillRect(control.get('start') - 2, control.get('top'), 2, control.get('computedHeight'));
                        ctx.fillRect(control.get('end'), control.get('top'), 2, control.get('computedHeight'));
                    }
                    ctx.fillStyle = "#ff00ff";
                    if(control.get('isRatioConstrained')) {
                        ctx.fillRect(control.get('start') - 2, control.get('top') - 2, 12, 2);
                        ctx.fillRect(control.get('start') - 2, control.get('top') - 2, 2, 12);
                        ctx.fillRect(control.get('end') - 10, control.get('bottom'), 12, 2);
                        ctx.fillRect(control.get('end'), control.get('bottom') - 10, 2, 12);
                    }

                    // Draw chain indicators
                    var chain = control.get('controlChain');
                    if(chain && chain.get('valid')) {
                        ctx.fillStyle = "#a6a6a6";
                        ctx.strokeStyle = "#a6a6a6";
                        chainControls = chain.get('uiPhoneControls');
                        var x, y;
                        chainControls.forEach(function(c, index) {
                            if(index === 0) {
                                if(chain.get('axis') === 'horizontal') {
                                    x = c.get('end') - 4;
                                    y = c.get('top') + (c.get('computedHeight') / 2) - 4;
                                    ctx.beginPath();
                                    ctx.moveTo(x+4, y+4);
                                    ctx.fillRect(x, y, 8, 8);
                                } else {
                                    x = c.get('start') + (c.get('computedWidth') / 2) - 4;
                                    y = c.get('bottom') - 4;
                                    ctx.beginPath();
                                    ctx.moveTo(x+4, y+4);
                                    ctx.fillRect(x, y, 8, 8);
                                }
                            } else if(index === (chainControls.get('length') - 1)){
                                if(chain.get('axis') === 'horizontal') {
                                    x = c.get('start') - 4;
                                    y = c.get('top') + (c.get('computedHeight') / 2) - 4;
                                    ctx.lineTo(x+4, y+4);
                                    ctx.stroke();
                                    ctx.fillRect(x, y, 8, 8);
                                } else {
                                    x = c.get('start') + (c.get('computedWidth') / 2) - 4;
                                    y = c.get('top') - 4;
                                    ctx.lineTo(x+4, y+4);
                                    ctx.stroke();
                                    ctx.fillRect(x, y, 8, 8);
                                }
                            } else {
                                if(chain.get('axis') === 'horizontal') {
                                    x = c.get('start') - 4;
                                    y = c.get('top') + (c.get('computedHeight') / 2) - 4;
                                    ctx.lineTo(x+4, y+4);
                                    ctx.stroke();
                                    ctx.fillRect(x, y, 8, 8);
                                    x = c.get('end') - 4;
                                    y = c.get('top') + (c.get('computedHeight') / 2) - 4;
                                    ctx.beginPath();
                                    ctx.moveTo(x+4, y+4);
                                    ctx.fillRect(x, y, 8, 8);
                                } else {
                                    x = c.get('start') + (c.get('computedWidth') / 2) - 4;
                                    y = c.get('top') - 4;
                                    ctx.lineTo(x+4, y+4);
                                    ctx.stroke();
                                    ctx.fillRect(x, y, 8, 8);
                                    x = c.get('start') + (c.get('computedWidth') / 2) - 4;
                                    y = c.get('bottom') - 4;
                                    ctx.beginPath();
                                    ctx.moveTo(x+4, y+4);
                                    ctx.fillRect(x, y, 8, 8);
                                }
                            }
                        });
                    }
                }
            }
        }
    },

    drawConstraint: function(constraint, control) {
        var ctx = this.get('ctx');
        if(ctx) {
            ctx.fillStyle = "#00ff00";
            var plus = 7
            if(constraint.get('withParent')) {
                var viewTop = constraint.get('uiPhoneControl.viewController.top');
                if(constraint.get('layoutEdge') === 'top') {
                    var endY = parseFloat(control.get('marginTop')) + plus;
                    ctx.fillRect(control.get('centerX'), viewTop, 2, endY);
                } else if(constraint.get('layoutEdge') === 'bottom') {
                    var endY = parseFloat(control.get('marginBottom')) + plus;
                    ctx.fillRect(control.get('centerX'), control.get('bottom') - plus, 2, endY);
                } else if(constraint.get('layoutEdge') === 'start') {
                    var endX = parseFloat(control.get('marginStart')) + plus;
                    ctx.fillRect(control.get('viewController.start'), control.get('centerY'), endX, 2);
                } else if(constraint.get('layoutEdge') === 'end') {
                    var endX = parseFloat(control.get('marginEnd')) + plus;
                    ctx.fillRect(control.get('end') - plus, control.get('centerY'), endX, 2);
                } else if(constraint.get('layoutEdge') === 'centerX') {
                    ctx.fillStyle = "#ffdd00";
                    var endX = control.get('start') - control.get('viewController.start') + plus;
                    ctx.fillRect(control.get('viewController.start'), control.get('centerY'), endX, 2);
                    ctx.fillRect(control.get('end') - plus, control.get('centerY'), endX, 2);
                    ctx.fillStyle = "#00ff00";
                } else if(constraint.get('layoutEdge') === 'centerY') {
                    ctx.fillStyle = "#ffdd00";
                    var endY = control.get('top') - control.get('viewController.top') + plus;
                    ctx.fillRect(control.get('centerX'), control.get('viewController.top'), 2, endY);
                    ctx.fillRect(control.get('centerX'), control.get('bottom') - plus, 2, endY);
                    ctx.fillStyle = "#00ff00";
                }
            } else {
                var x, y;
                var color = this.getColor();
                var r = 5;
                if(constraint.get('layoutEdge') === 'top' || constraint.get('layoutEdge') === 'bottom') {
                    x = control.get('centerX');
                    y = control.get(constraint.get('layoutEdge'));
                    this.drawCircle(x, y, r, color);
                } else if(constraint.get('layoutEdge') === 'start' || constraint.get('layoutEdge') === 'end') {
                    x = control.get(constraint.get('layoutEdge'));
                    y = control.get('centerY');
                    this.drawCircle(x, y, r, color);
                } else if(constraint.get('layoutEdge') === 'centerY') {
                    ctx.fillStyle = "#ffdd00";
                    if(control.get('end') < constraint.get('referenceElement.start')) {
                        var endX = constraint.get('referenceElement.start') - control.get('end') + plus*2;
                        ctx.fillRect(control.get('end') - plus, control.get('centerY'), endX, 2);
                    } else  {
                        var endX = control.get('start') - constraint.get('referenceElement.end') + plus*2;
                        ctx.fillRect(constraint.get('referenceElement.end') - plus, control.get('centerY'), endX, 2);
                    }
                } else if(constraint.get('layoutEdge') === 'centerX') {
                    ctx.fillStyle = "#ffdd00";
                    if(control.get('bottom') < constraint.get('referenceElement.top')) {
                        var endY = constraint.get('referenceElement.top') - control.get('bottom') + plus*2;
                        ctx.fillRect(control.get('centerX'), control.get('bottom') - plus, 2, endY);
                    } else {
                        var endY = control.get('top') - constraint.get('referenceElement.bottom') + plus*2;
                        ctx.fillRect(control.get('centerX'), constraint.get('referenceElement.bottom') - plus, 2, endY);
                    }
                }
                if(constraint.get('referenceLayoutEdge') === 'top' || constraint.get('referenceLayoutEdge') === 'bottom') {
                    x = constraint.get('referenceElement.centerX');
                    y = constraint.get('referenceElement.' + constraint.get('referenceLayoutEdge'));
                    this.drawCircle(x, y, r, color);
                } else if(constraint.get('referenceLayoutEdge') === 'start' || constraint.get('referenceLayoutEdge') === 'end') {
                    x = constraint.get('referenceElement.' + constraint.get('referenceLayoutEdge'));
                    y = constraint.get('referenceElement.centerY');
                    this.drawCircle(x, y, r, color);
                }
            }
        }
    },

    drawCircle: function(x, y, radius, color) {
        var ctx = this.get('ctx');
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
    },

    getColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    clear: function() {
        var ctx = this.get('ctx');
        if(ctx) {
            ctx.fillStyle = '#fff';
            ctx.clearRect(0, 0, this.get('width'), this.get('height'));
        }
    }
});
