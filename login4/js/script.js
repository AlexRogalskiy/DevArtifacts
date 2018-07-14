  var appIntro = new TimelineMax({
      delay: 0.2
    }),
    app = $('#iphone6 svg'),
    logo = app.find('g#logo'),
    logoType = app.find('path[id*="type"]'),
    logoMark = app.find('#mark'),
    logoTagline = app.find('#tagline'),
    topBg1 = app.find('#top_bg1'),
    topBg = app.find('#top_bg'),
    topBg2 = app.find('#top_bg2'),
    emailType = app.find('#EMAIL'),
    passwordType = app.find('#PASSWORD'),
    forgotType = app.find('#FORGOT'),
    inputBgEmail = app.find('#input1_bg'),
    inputBgPassword = app.find('#input2_bg'),
    inputBgEmailAccent = app.find('#input1_accent'),
    inputBgPasswordAccent = app.find('#input2_accent'),
    inputBgEmail2 = app.find('#input1_bg2'),
    inputBgPassword2 = app.find('#input2_bg2'),
    inputBgPasswordButtonActive = app.find('#input2_bg_button_active'),
    inputBgEmailAccent2 = app.find('#input1_accent2'),
    inputBgPasswordAccent2 = app.find('#input2_accent2'),
    topAccent = app.find('#top_accent'),
    topAccent2 = app.find('#top_accent2'),
    bgShadow = app.find('#bg_shadow'),
    bgShadow2 = app.find('#bg_shadow2'),
    signup = app.find('#signup'),
    copy = app.find('#copy'),
    submitBtn = app.find('#submit'),
    arrowPlain = app.find('#arrow_plain'),
    arrowPlainShadow = app.find('#arrow_plain_shadow'),
    emailAddressGroup = app.find('#email_address'),
    emailAddress = app.find('#email_address path'),
    pwGroup = app.find('#asterisks'),
    pwAsterisks = app.find('#asterisks path'),
    iOSKeyboard = app.find('#ios_keyboard'),
    elasticEase = Elastic.easeOut.config(1, 0.4),
    smootherElasticEase = Elastic.easeOut.config(1.25, 0.9),
    harderElasticEase = Elastic.easeOut.config(1.75, 0.5),
    emailKeys = [
      iOSKeyboard.find('g#a rect'),
      iOSKeyboard.find('g#d rect'),
      iOSKeyboard.find('g#m rect'),
      iOSKeyboard.find('g#i rect'),
      iOSKeyboard.find('g#n rect'),
      iOSKeyboard.find('g#at rect'),
      iOSKeyboard.find('g#d rect'),
      iOSKeyboard.find('g#r rect'),
      iOSKeyboard.find('g#i rect'),
      iOSKeyboard.find('g#b rect'),
      iOSKeyboard.find('g#b rect'),
      iOSKeyboard.find('g#b rect'),
      iOSKeyboard.find('g#l rect'),
      iOSKeyboard.find('g#e rect'),
      iOSKeyboard.find('g#dot rect'),
      iOSKeyboard.find('g#c rect'),
      iOSKeyboard.find('g#o rect'),
      iOSKeyboard.find('g#m rect')
    ],
    nextKeyBg = iOSKeyboard.find('g#Return rect'),
    nextKeyNext = iOSKeyboard.find('g#Return text#next'),
    nextKeySubmit = iOSKeyboard.find('g#Return text#submit'),
    passwordKeys = [
      iOSKeyboard.find('g#s rect'),
      iOSKeyboard.find('g#l rect'),
      iOSKeyboard.find('g#a rect'),
      iOSKeyboard.find('g#m rect'),
      iOSKeyboard.find('g#d rect'),
      iOSKeyboard.find('g#u rect'),
      iOSKeyboard.find('g#n rect'),
      iOSKeyboard.find('g#k rect')
    ],
    inputBgs = [
      inputBgEmail,
      inputBgPassword
    ];

  // appIntro.timeScale(0.2);

  TweenMax.set(iOSKeyboard, {
    yPercent: 100
  });
  TweenMax.set([arrowPlain, arrowPlainShadow], {
    y: -41
  });
  TweenMax.set(submitBtn, {
    y: -42
  });

  appIntro
    .from(topBg, 0.3, {
      fill: '#3f244e'
    })
    .from(topBg, 0.8, {
      morphSVG: topBg1,
      ease: Elastic.easeOut.config(1.2, 0.75)
    }, '-=0.2')
    .add('shadowTrigger', '-=0.25')
    .from(logoTagline, 1, {
      autoAlpha: 0,
      y: 20,
      ease: elasticEase
    }, "-=0.5")
    .add('taglineForce', "-=0.82")
    .from(logoMark, 1, {
      transformOrigin: 'right bottom',
      autoAlpha: 0,
      scale: 0,
      y: 100,
      ease: elasticEase
    }, 'taglineForce')
    .staggerFrom(logoType, 1, {
      transformOrigin: 'left bottom',
      autoAlpha: 0,
      scaleY: 0,
      y: 100,
      ease: elasticEase
    }, 0.1, 'taglineForce')
    .add('inputTrigger', '-=1.5')
    .staggerFrom([inputBgEmail, inputBgPassword], 1, {
      y: 30,
      autoAlpha: 0,
      ease: smootherElasticEase
    }, 0.075, 'inputTrigger')
    .staggerFrom([inputBgEmailAccent, inputBgPasswordAccent], 0.5, {
      y: 30,
      autoAlpha: 0,
      ease: smootherElasticEase
    }, 0.075, 'inputTrigger+=0.25')
    .staggerFromTo([emailType, passwordType, forgotType], 1, {
      y: 16,
      transformOrigin: "20% bottom",
      rotation: 20,
      opacity: 0
    }, {
      y: 0,
      rotation: -6,
      opacity: 1,
      ease: smootherElasticEase
    }, 0.075, 'inputTrigger+=0.5')
    .from(topAccent, 1, {
      y: -100,
      opacity: 0,
      ease: Elastic.easeOut.config(1.2, 1)
    }, 'shadowTrigger')
    .from(bgShadow, 0.5, {
      y: -120,
      opacity: 0,
      ease: Elastic.easeOut.config(1, 0.8)
    }, 'shadowTrigger-=0.2')
    .from(signup, 0.5, {
      transformOrigin: 'center',
      y: 20,
      autoAlpha: 0,
      scale: 0.5,
      ease: smootherElasticEase
    }, '-=1')
    .from(copy, 2, {
      autoAlpha: 0
    }, '-=1');

  var buttonAni = function() {
    var buttonAniTl = new TimelineMax(),
      arrowAniDuration = 1,
      straightenDuration = 1;

    TweenMax.set(inputBgPasswordButtonActive, {
      y: -40
    });

    // buttonAniTl.timeScale(0.2);

    buttonAniTl
      .add('straightenStart', 0.25)
      .set([emailAddressGroup, pwGroup], {
        opacity: 1
      })
      .to(topBg, straightenDuration, {
        morphSVG: topBg2,
        y: -45,
        ease: elasticEase
      }, 'straightenStart')
      .to(topAccent, straightenDuration, {
        morphSVG: topAccent2,
        y: -53,
        ease: elasticEase
      }, 'straightenStart')
      .to(bgShadow, straightenDuration, {
        morphSVG: bgShadow2,
        y: -53,
        ease: elasticEase
      }, 'straightenStart')
      .to(inputBgEmail, straightenDuration, {
        morphSVG: inputBgEmail2,
        y: -40,
        fill: '#21011B',
        ease: smootherElasticEase,
        opacity: 0.92,
      }, 'straightenStart')
      .to(inputBgPassword, straightenDuration, {
        morphSVG: inputBgPassword2,
        y: -40,
        fill: '#21011B',
        ease: smootherElasticEase,
      }, 'straightenStart')
      .to(inputBgEmailAccent, straightenDuration, {
        morphSVG: inputBgEmailAccent2,
        y: -40,
        ease: elasticEase
      }, 'straightenStart')
      .to(inputBgPasswordAccent, straightenDuration, {
        morphSVG: inputBgPasswordAccent2,
        y: -40,
        ease: elasticEase
      }, 'straightenStart')
      .to(forgotType, 0.75, {
        autoAlpha: 0,
        y: -70,
        ease: smootherElasticEase
      }, 'straightenStart-=0.25')
      .to(iOSKeyboard, 0.5, {
        yPercent: 0,
        ease: Power2.easeOut
      }, 'straightenStart')
      .to([signup, copy], 0.25, {
        autoAlpha: 0
      }, 'straightenStart')
      .staggerTo([emailType, passwordType], 1.5, {
        transformOrigin: 'left bottom',
        rotation: 0,
        scale: 0.5,
        opacity: 0.6,
        y: -75,
        ease: elasticEase
      }, 0.05, 'straightenStart-=0.05')
      .add('type', '-=0.5')
      .set([emailAddress, pwAsterisks], {
        y: -40
      }, 0)
      .staggerFromTo(emailAddress, 0.5, {
        opacity: 0
      }, {
        opacity: 1
      }, 0.05, 'type')
      .staggerFromTo(emailKeys, 0.5, {
        fill: 'rgba(255,255,255,1)'
      }, {
        fill: 'rgba(0,0,0,.0.8)',
        ease: SlowMo.ease.config(0.1, 1, true)
      }, 0.05, 'type')
      .add('nextKeyChange')
      .to(nextKeyBg, 0.5, {
        fill: 'rgba(0,0,0,.0.8)',
        ease: SlowMo.ease.config(0.1, 1, true)
      }, 'nextKeyChange')
      .to(nextKeyNext, 0.25, {
        opacity: 0
      }, 'nextKeyChange+=0.25')
      .to(nextKeySubmit, 0.25, {
        opacity: 1
      }, 'nextKeyChange+=0.25')
      .to(inputBgEmail, 0.125, {
        opacity: 0.48,
      })
      .to(inputBgPassword, 0.125, {
        opacity: 0.92,
      })
      .add('pwType', '+=0.1')
      .staggerFromTo(pwAsterisks, 0.5, {
        opacity: 0
      }, {
        opacity: 1
      }, 0.05, 'pwType')
      .staggerFromTo(passwordKeys, 0.5, {
        fill: 'rgba(255,255,255,1)'
      }, {
        fill: 'rgba(0,0,0,.0.8)',
        ease: SlowMo.ease.config(0.1, 1, true)
      }, 0.05, 'pwType')
      .add('buttonAppear', '-=0.8')
      .fromTo(inputBgPasswordButtonActive, 0.5, {
        transformOrigin: 'right',
        opacity: 0,
        scaleX: 0,
        ease: smootherElasticEase
      }, {
        transformOrigin: 'right',
        opacity: 0.25,
        scaleX: 1,
        ease: smootherElasticEase
      }, 'buttonAppear')
      .fromTo(arrowPlain, arrowAniDuration, {
        transformOrigin: 'left center',
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        ease: elasticEase
      }, 'buttonAppear+=0.25')
      .to(arrowPlainShadow, arrowAniDuration, {
        opacity: 0.35
      }, 'buttonAppear+=0.5');
  };

  inputBgEmail.click(function() {
    buttonAni();
  });

  inputBgPasswordButtonActive.hover(function() {
    TweenMax.to(inputBgPasswordButtonActive, 1, {
      opacity: 1
    });
  });