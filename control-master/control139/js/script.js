/**
 * Element class
 * > generate a node
 **/
var Element = /** @class */ (function () {
    /**
     Class constructor
     **/
    function Element(options) {
        if (options === void 0) { options = {}; }
        /**
         * global properties of the node
         * @type {{}}
         */
        this.node = {};
        /**
         * The location where we should insert the generated node
         * @type {{}}
         */
        this.where = {};
        /**
         * Events binbed to the node
         * @type {{}}
         */
        this.events = {};
        /**
         * The created element
         */
        this.element = null;
        for (var key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
        this.createNode();
        return this.element;
    }
    /**
     Bind events to the node
     **/
    Element.prototype.bindEventsListeners = function () {
        for (var key in this.events) {
            this.element.addEventListener(key, this.events[key]);
        }
    };
    /**
     Create the node
     **/
    Element.prototype.createNode = function () {
        var node = document.createElement(this.node.name);
        if (this.node.content)
            node.innerHTML = this.node.content;
        for (var key in this.node.attrs) {
            node.setAttribute(key, this.node.attrs[key]);
        }
        this.where.destination.insertAdjacentElement(this.where.position, node);
        this.element = node;
        if (this.element && this.events) {
            this.bindEventsListeners();
        }
    };
    return Element;
}());
// ---------------
// FUNCTIONS
// ---------------
/**
 * On input click
 * @param e
 */
function inputClick(e) {
    var target = e.currentTarget, classes = target.classList;
    if (!classes.contains('collapse') && !classes.contains('expand') && !classes.contains('active') && !target.getAttribute('readonly')) {
        var animationEnd_1 = function () {
            target.removeEventListener('webkitAnimationEnd', animationEnd_1);
            target.removeEventListener('animationend', animationEnd_1);
            classes.remove('expand');
            target.focus();
        };
        classes.add('active', 'expand');
        target.addEventListener('webkitAnimationEnd', animationEnd_1);
        target.addEventListener('animationend', animationEnd_1);
        target.setAttribute('placeholder', 'EMAIL');
    }
}
/**
 * On input blur
 * @param e
 */
function inputBlur(e) {
    // Do not hesitate to tell me if you have a cleaner solution to get the active element inside the blur event ! :)
    setTimeout(function () {
        var input = e.target, button = input.nextSibling, target = document.activeElement, classes = input.classList;
        if (!classes.contains('expand') && classes.contains('active') && target !== button) {
            var placeholder = input.dataset.placeholder, animationEnd_2 = function () {
                input.removeEventListener('webkitAnimationEnd', animationEnd_2);
                input.removeEventListener('animationend', animationEnd_2);
                classes.remove('collapse');
                input.blur();
            };
            classes.add('collapse');
            classes.remove('active');
            input.addEventListener('webkitAnimationEnd,', animationEnd_2);
            input.addEventListener('animationend', animationEnd_2);
            input.value = '';
            input.setAttribute('placeholder', placeholder);
        }
    }, 10);
}
/**
 * On form submit
 */
function formSubmit(e) {
    e.preventDefault();
    var input = e.target.querySelector('input[type=email]');
    input.dataset.placeholder = 'THANK YOU!';
    input.setAttribute('readonly', true);
    input.focus();
    input.blur();
}
// ---------------
// NODES CREATION
// ---------------
var main = new Element({
    'node': {
        'name': 'main'
    },
    'where': {
        'destination': document.querySelector('body'),
        'position': 'beforeEnd'
    }
}), form = new Element({
    'node': {
        'name': 'form'
    },
    'where': {
        'destination': main,
        'position': 'beforeEnd'
    },
    'events': {
        'submit': formSubmit
    }
}), input = new Element({
    'node': {
        'name': 'input',
        'attrs': {
            'type': 'email',
            'placeholder': 'NOTIFY ME',
            'data-placeholder': 'NOTIFY ME',
            'required': 'required'
        }
    },
    'where': {
        'destination': form,
        'position': 'beforeEnd'
    },
    'events': {
        'click': inputClick,
        'blur': inputBlur
    }
}), button = new Element({
    'node': {
        'name': 'button',
        'content': 'SEND',
        'attrs': {
            'type': 'submit',
            'placeholder': 'NOTIFY ME',
            'data-placeholder': 'NOTIFY ME'
        }
    },
    'where': {
        'destination': input,
        'position': 'afterEnd'
    }
});
