class App {
    constructor() {
        this._masterTL = new TimelineMax({ paused: true });
        this._setupSlick();
        this._setupTLs();        
        this.enable();
    }
    
    _setupTLs() {        
        this._splash();
        this._signin();    
        this._menu();
        this._grid();
    }
    
    _setupSlick() {
        $('.js-slides').slick({
            dots: true,
            infinite: false
        });
        
        $('.js-slides').on('swipe', (event, slick, direction) => {
            console.log(slick.currentSlide);
            if (slick.currentSlide == 2) {
                $('.js-start').prop('disabled', false);
            } else {
                $('.js-start').prop('disabled', true);
            }
        });
    }
    
    enable() {        
        $('.js-burger').on('click', (event) => {
            event.preventDefault();
            this._masterTL.tweenFromTo('menustart', 'menuend');
        });
        
        $('.app-menu').on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this._masterTL.tweenFromTo('menuend', 'menustart');
        });
        
        $('.js-start').on('click', (event) => {
            event.preventDefault();
            this._masterTL.tweenFromTo('signinstart', 'signinend');
        });
        
        $('.js-learnClose').on('click', (event) => {
            event.preventDefault();
            this._masterTL.tweenFromTo('signinend', 'signinstart');
        });        
        
        $('.js-login').on('click', (event) => {
            event.preventDefault();
            this._masterTL.tweenFromTo('closesigninstart', 'closesigninend');
        });
        
        $('.js-menueItem').on('click', (event) => {
            event.preventDefault();
            this._masterTL.tweenFromTo('gridstart', 'gridend');
        });
        
        $('.productList > *').on('click', (event) => {
            event.preventDefault();
            this._masterTL.tweenFromTo('popstart', 'popend');
        });
        
        $('.js-itemClose').on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this._masterTL.tweenFromTo('popend', 'popstart');
        });
        
        $('.js-homeBtn').on('click', (event) => {
            event.preventDefault();
            this._masterTL.tweenFromTo('gridend', 'gridstart');
        });
        
        $('.js-learn').on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this._masterTL.seek('splashstart', false).tweenFromTo('splashstart', 'splashend');
        });
        
        this._masterTL.tweenFromTo('splashstart', 'splashend');
    }    
    
    _splash() {
        let tl = new TimelineMax({ paused: false });
        
        tl.staggerFrom($('.app-splash-logo > *'), 1, {
            opacity: 0,
            scale: 0.25,
            transformOrigin: '50% 50%',
            ease: Elastic.easeOut.config(1, 0.3)
        }, 0.1);
        
        tl.from('.app-splash-logo', 1, {
            scale: 0.25,
            transformOrigin: '50% 50%',
            ease: Elastic.easeOut.config(1, 0.3)
        }, '-0.5');
        
        tl.to('.app-splash-logo', 1, {
            opacity: 0
        });
        
        tl.to('.app-splash', 1, {
            opacity: 0,
            display: 'none'
        });
        
        this._masterTL
            .addLabel('splashstart')
            .add(tl)
            .addLabel('splashend');
    }
    
    _signin() {
        let tl = new TimelineMax({ paused: false });
        let tl2 = new TimelineMax({ paused: false });
        
        tl.to('.js-start', 0.25, {
            backgroundColor: '#3c5a9c',
            ease: Power2.easeInOut,
            oncomplete: () => {
                $('.js-start').text('Sign In with Facebook');
            },
            onReverseComplete: () => {
                $('.js-start').text('Get Started');
            }
        });
        
        tl.to('.app-learn-start', 0.25, {
            bottom: '+=250px',
            ease: Back.easeOut.config(1.7),
        }, '-0.25');
        
        tl.staggerTo('.app-learn-start > *', 0.25, {
            opacity: 1,
            ease: Power2.easeInOut,
        }, 0.15, '-0.25');
        
        tl.staggerTo($('.feature').eq(2).find('> *'), 0.15, {
            top: '-100px',
            opacity: 0,
            ease: Power2.easeInOut
        }, 0.15, '-0.5');
        
        tl2.to('.app-learn', 0.25, {
            opacity: 0,
            display: 'none',
            ease: Power2.easeInOut
        });
        
        this._masterTL
            .addLabel('signinstart')
            .add(tl)
            .addLabel('signinend')
            .addLabel('closesigninstart')
            .add(tl2)
            .addLabel('closesigninend');
    }
    
    _menu() {
        let tl = new TimelineMax({ paused: false });
        
        tl.from('.app-menu', 0.5, {
            backgroundColor: 'rgba(0,0,0,0)',
            ease: Power2.easeInOut,
            onStart: () => {
                $('.app-menu').css({display: 'block'});
            },
            onReverseComplete: () => {
                $('.app-menu').css({display: 'none'});
            }
        });
        
        tl.from('.app-menu-inner', 0.5, {
            left: '-70%',
            ease: Power2.easeInOut
        }, -0.15);
        
        this._masterTL
            .addLabel('menustart')
            .add(tl)
            .addLabel('menuend');
    }
    
    _grid() {
        let tl = new TimelineMax({ paused: false });
        let tl2 = new TimelineMax({ paused: false });
        
        tl.staggerTo('.js-menueItem.transition', 0.15, {
            left: '-100%',
            ease: Power2.easeInOut
        }, 0.15);
        
        tl.to('.app-home', 0.5, {
            left: '-100%',
            ease: Power2.easeInOut
        }, '0.25');
        
        tl.to('.app-grid', 0.5, {
            left: '0%',
            ease: Power2.easeInOut
        }, '0');
        
        tl2.to('.productList > *:nth-child(7)', 0.5, {
            css: {
                transform: 'scale(2.8) translateX(33px) translateY(-38px)'
            },
            ease: Elastic.easeInOut.config(1, 0.75)
        });
        
        tl2.to('.productList > *:nth-child(7) > div', 0.5, {
            opacity: 1,
            ease: Elastic.easeInOut.config(1, 0.75)
        }, '0');
        
        tl2.to('.productList > *:nth-child(7)', 0.5, {
            borderRadius: '2px',
            ease: Elastic.easeInOut.config(1, 0.75)
        }, '0');
        
        tl2.to('.productList > *:nth-child(7) > svg', 0.5, {
            opacity: 1,
            ease: Elastic.easeInOut.config(1, 0.75)
        }, '0');
        
        tl2.to('.productList > *:not(:nth-child(7))', 0.5, {
            filter: 'blur(10px)',
            onStart: () => {
                $('.productList > *:nth-child(7)').css({'z-index': 1});
            },
            onReverseComplete: () => {
                $('.productList > *:nth-child(7)').css({'z-index': 0});
            }
        }, '0');
        
        this._masterTL
            .addLabel('gridstart')
            .add(tl)
            .addLabel('gridend')
            .addLabel('popstart')
            .add(tl2)
            .addLabel('popend');
    }
}

new App();