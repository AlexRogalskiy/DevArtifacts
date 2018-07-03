const { TransitionGroup } = React.addons;

//Watermark
function Watermark(props) {
  //props and default props
  const fillColor = props.fillColor || 'white'

  return (
    <svg className="watermark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 289.5 252.1" aria-labelledby="title" role="presentation"><title id="title">watermark</title><g fill={fillColor}><path d="M137.3 14.8l.6-1-.5-.3-.9 1.6.5.3zM140.8 8.7h.3l.6-1-.5-.3-.6 1.1-.3.5.5.3zM122.2 41h.1l-.5-.3-.9 1.6.5.3zM124.9 34.88l.9-1.57.52.3-.9 1.58zM128.73 28.1l.9-1.58.52.3-.9 1.57zM170.4 43.1l.52-.3.9 1.56-.52.3zM133.2 21.9l.7-1.2-.5-.3-.9 1.6.5.3zM174.28 49.94l.52-.3.9 1.56-.52.3zM163.4 31.2h.1l.5-.3-.9-1.6-.5.3.8 1.5zM167.4 38l.5-.3-.9-1.6-.5.3v.2zM147.3 3.2l.6 1 .5-.3-.9-1.5-.5.3.3.5zM154.8 16.12l.5-.3.9 1.56-.5.3zM150.86 9.47l.52-.3.9 1.55-.52.3zM159.6 24.5l.5-.3-.3-.6-.6-1-.5.3.5 1 .4.6M81.87 109.7l.9-1.56.52.3-.9 1.56zM90.3 96.2l.7-1.3-.5-.3-.9 1.6.5.3zM116.97 48.9l.9-1.56.52.3-.9 1.56zM78.5 116.7l.9-1.5-.5-.3-.9 1.6.5.3zM70.62 129.63l.9-1.56.52.3-.9 1.56zM75.2 122.4l.3-.5-.5-.3-.9 1.6.5.3zM86.7 102.5h.2l.2-.4-.5-.3-.4.7-.5.8.5.3zM93.54 89.42l.9-1.56.52.3-.9 1.56zM113.8 55.5h.1l.5-.9-.5-.3-.5.9-.4.6.5.3zM106.3 68.5l.3-.6-.5-.3-.9 1.6.5.3zM109.16 62.4l.9-1.55.52.3-.9 1.56zM101.35 75.9l.9-1.55.52.3-.9 1.56zM98.3 82.4l.6-1-.5-.3-.9 1.6.5.3zM144.25 1.6l.9-1.55.52.3-.9 1.56zM252.28 185.04l.52-.3.9 1.56-.52.3zM249.2 179.8h.1l.5-.3-.9-1.6-.5.3.8 1.5zM257.1 193.4l.5-.3-.9-1.6-.5.3h.1zM178.25 56.68l.52-.3.9 1.56-.52.3zM245.4 173.1l.5-.3v-.1l-.9-1.5-.5.3.9 1.5v.1M236.67 158.06l.52-.3.9 1.56-.53.3zM260.08 198.53l.52-.3.9 1.56-.52.3zM275.7 225.5l.5-.3.9 1.57-.5.3zM272.6 220.2v.2l.5-.3v-.2l-.8-1.3-.5.3.8 1.3zM233.4 152.4l.3.5.5-.3-.9-1.6-.5.3.6 1.1zM279.57 232.35l.52-.3.9 1.56-.53.3zM67 136.5l.6-1.1-.5-.3-.9 1.6.5.3zM268 212.3l.7 1.3.5-.3-.8-1.3v-.2l-.5.3v.2zM264.9 206.9l.5-.3-.9-1.6-.5.3.4.8zM241.5 166.3l.5-.3-.6-1.1-.3-.4-.5.3.2.4.7 1.1M189.9 76.92l.5-.3.9 1.56-.5.3zM194 84.1l.7 1.2.5-.3-.9-1.6-.5.3.2.3zM197.7 90.4l.5-.3.9 1.57-.5.3zM182.08 63.43l.52-.3.9 1.56-.52.3zM186.9 71.7l.5-.3-.4-.7-.5-.8-.5.3.4.8.5.7M201.57 97.25l.52-.3.9 1.56-.53.3zM224.98 137.73l.52-.3.9 1.56-.52.3zM206.3 105.4h.1l.5-.3-.9-1.6-.5.3.8 1.4zM217.18 124.24l.52-.3.9 1.55-.52.3zM228.86 144.57l.52-.3.9 1.55-.52.3zM222 132.6l.5-.3-.9-1.6-.5.3.2.3zM209.37 110.74l.52-.3.9 1.56-.53.3zM214.2 119l.5-.3-.5-.9-.4-.6-.5.3.3.6.6.9M240.9 251.5h1.8v.6h-1.8zM62.3 143.44l.9-1.56.53.3-.9 1.56zM162.9 251.5v.6h1.8v-.6h-1.8M194.1 251.5h1.8v.6h-1.8zM178.5 251.5h1.8v.6h-1.8zM147.3 251.5h1.8v.6h-1.8zM186.3 251.5h1.8v.6h-1.8zM155.1 251.5h1.8v.6h-1.8zM139.5 251.5h1.8v.6h-1.8zM100.5 251.5h1.8v.6h-1.8zM116.1 251.5h1.8v.6h-1.8zM108.3 251.5v.6h1.8v-.6h-1.8M131.7 251.5h1.8v.6h-1.8zM123.9 251.5h1.8v.6h-1.8zM272.1 251.5v.6h1.8v-.6h-1.8M279.9 251.5v.6h1.8v-.6h-1.8M287.7 251.5h1.8v.6h-1.8zM92.7 251.5h1.8v.6h-1.8zM288.3 247.4l.5-.3-.9-1.6-.5.3.5.9zM264.3 251.5h1.8v.6h-1.8zM283.5 239.1l.4.7.5.8.5-.3-.9-1.6zM225.3 251.5h1.8v.6h-1.8zM256.5 251.5h1.8v.6h-1.8zM201.9 251.5h1.8v.6h-1.8zM209.7 251.5h1.8v.6h-1.8zM217.5 251.5v.6h1.8v-.6h-1.8M233.1 251.5h1.8v.6h-1.8zM248.7 251.5h1.8v.6h-1.8zM170.7 251.5h1.8v.6h-1.8zM23.35 211l.9-1.55.52.3-.9 1.56zM27.8 204.5l.8-1.4-.5-.3-.9 1.5.5.3zM35.02 190.73l.9-1.56.52.3-.9 1.56zM32.3 196.6l.2-.4-.5-.3-.2.4-.7 1.2.5.3zM15.54 224.52l.9-1.56.52.3-.9 1.56zM19.4 217.74l.9-1.56.52.3-.9 1.56zM50.64 163.72l.9-1.56.52.3-.9 1.56zM54.5 156.94l.9-1.56.52.3-.9 1.56zM12.4 231.1l.6-1.1-.5-.3-.9 1.6.5.3zM59.5 149.5l.3-.5-.5-.3-.3.6-.6 1 .5.3zM40.4 182.7l-.6-.3-.9 1.5.6.3.9-1.5M42.83 177.23l.9-1.56.52.3-.9 1.56zM47.44 170.3l.9-1.58.52.3-.9 1.57zM7.7 238l.5.3.7-1.2.2-.3-.5-.3zM53.7 251.5v.6h1.8v-.6h-1.8M45.9 251.5v.6h1.8v-.6h-1.8M61.5 251.5h1.8v.6h-1.8zM38.1 251.5h1.8v.6h-1.8zM77.1 251.5h1.8v.6h-1.8zM69.3 251.5h1.8v.6h-1.8zM22.5 251.5h1.8v.6h-1.8zM30.3 251.5h1.8v.6h-1.8zM6.9 251.5h1.8v.6H6.9zM4.6 243.4l-.8 1.4.5.3.8-1.3v-.2l-.5-.3zM84.9 251.5h1.8v.6h-1.8zM14.7 251.5h1.8v.6h-1.8zM.6 251.6l.7-1.3-.5-.3-.8 1.3a.6.6 0 0 0 .5.9h.3v-.6H.6z"/><path data-name="&lt;Compound Path&gt;" d="M275.7 235.7l-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.8-6-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.1-7.2-4.3-6.9-2.1-3.6-2 3.6-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.4 6.8-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.2 7-4.1 7.2-4.1 7.2-4.2 7-4.1 7.2-4.1 7.2-4.1 7.2-4.2 7-4.1 7.2-4.1 7.2-4.1 7.2-4.2 7-4.1 7.2-4.2 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-4.1 7.2-2.1 3.6H282l-2.1-3.6zm-130.1-2l-6-.5-1.4-2.3-2.1-3.6-2.1-3.6-.4-.7 12-2.1 12 2.2-.4.7-2.1 3.6-2.1 3.6-1.4 2.3zm5.7.2v.3h.1zm-9.6.1h-1.6v-.2zm33.7-76.1l-29.8 15.8-29.8-15.8 29.8-25.2zm-31.1-27.1h2.5l-1.3 1.1zm1.3 89.3l-15.1-2.7-.6-1.1-2.1-3.6-2.1-3.6-.3-.5 20.3-6.5 20.3 6.5-.3.5-2.1 3.6-2.1 3.6-.6 1.1zm14.8-2l-1.1 1.9-1.4 2.3-10.6-1.9zm-16.5 2.3l-10.6 1.9-1.3-2.3-1.1-1.9zM114.5 192l1.8 3.1 2.1 3.6 2.1 3.6 2 3.7 1.3 2.3-15.7 5-27-4.8 32-17zm-.6-.8zm31.8 10.2l-29.9-9.6-.5-.9-.2-.3 30.6-16.2 30.6 16.2-.2.3-.5.9zm29.5-8.8l-1.1 2-2.1 3.6-2.1 3.6-2.1 3.6-1.5 2.6-19.6-6.3zm-30.5 9.1l-19.6 6.3-1.5-2.6-2.1-3.6-2.1-3.6-2.1-3.6-1.1-1.9zm-20.5 7.2l.4.8 2.1 3.6 2.1 3.6v.2l-19.3-3.5zm38.2 8l2.1-3.6 2.1-3.6.4-.8 14.7 4.7-19.5 3.5zm4.9-8.6l1.4-2.3 2.1-3.6 2.1-3.6 2.1-3.6 1.8-3.1 1.3-.4 32 17-27 4.8zm9.9-17.1zm1.6.1l26.1-8.4 25.9 21.9-19.8 3.6zm-.7-.4l-.6-.3 1.6-2.8 2.1-3.6 2.1-3.6 2.1-3.6 2.1-3.6 2-3.4 15 12.5zm10.8-22.4L176.5 158l26.8-14.2-2 3.4-2.1 3.6-2.1 3.6-2.1 3.6-2.1 3.6-2.1 3.6zm-.3.5l-2.1 3.6-2.1 3.6-2.1 3.6-2.1 3.6-2.1 3.6-1.6 2.8-30.2-15.8 29.6-15.7zm-43.6 5l-30.3 16.1-1.6-2.8-2.1-3.6-2.1-3.6-2.1-3.6-2.1-3.6-2.1-3.6 12.8-10.8zm-42.7-5.5l-1.8-3.2-2.1-3.6-2.1-3.6-2.1-3.6-2.1-3.6-2.1-3.6-2-3.4 26.8 14.1zm1.3 4.7l2.1 3.6 2.1 3.6 2.1 3.6 2.1 3.6 1.6 2.8-.6.3-26.3-8.4 14.9-12.6zm8.7 18l-32.1 17-19.8-3.6 25.9-21.9zm-33 17.5l-32.6 17.4-10.6-.8 23.6-20zm1 .2l26.7 4.8-42.7 13.8-16.5-1.3zm27.9 5l21.1 3.8 1.6 2.8 1.1 2-39.5 7.1-26.6-2zm24.2 9.1l.6 1.1 2.1 3.6 2.1 3.6.9 1.6-43.3-3.3zm21.6 8.4l2.1-3.6 2.1-3.6.6-1.1 37.5 6.7-43.3 3.3zm5.2-8.9l1.1-2 1.6-2.8 21.1-3.8 42.4 13.6-26.6 2zm25.1-8.7L211 209l32.5 17.2-16.5 1.3zm27.6-5l19.6-3.5 23.6 20-10.6.8zm20.3-3.6l15.1-2.7 16.6 22.2-8 .6zm-.6-.5l-25.9-21.9 21.7-7L247 202zm-26.5-22.4l-15.3-12.9 1.9-3.4 2.1-3.6 2.1-3.6 2.1-3.6 2.1-3.6 2.1-3.6 1.8-3.1 22.9 30.6zm-1.3-39.5h-.2l-9.1-12.1h16.2l-1.1 1.8-2.1 3.6-2.1 3.6zm-.8.4l-27.1 14.4-29.9-25.3 1.7-1.5h46zm-11.2-13.6h-42.5L176 107l16.9 22.6zm-43.5 0h-5.4l-27.3-23.1 30-40.1 30 40.1zm-6.3 0H98.4l16.9-22.6zm-42.5 1.2h44l1.7 1.5-29.9 25.3-27.1-14.4 9.3-12.4zm-11.8 12.1h-.2l-1.7-2.9-2.1-3.6-2.1-3.6-1.1-2h16.2zm1.3 4.9l2.1 3.6 2.1 3.6 2.1 3.6 2.1 3.6 2.1 3.8 1.9 3.3-15.3 13-21.9-7 22.9-30.6zm-3.4 34.9l-26 22-15.3-2.7 19.6-26.2zM59 205.2l-23.7 20-8-.6 16.6-22.2zm-23.5 20.7l10.2.8-19.2 10.2h-3.9zm11.4.9l15.9 1.2-28.5 9.1-6.6-.2zm17.5 1.3l25.8 2-41.5 7.4-12.5-.3zm28.1 2.1l46 3.5.3.5-55.4 4.2-31.9-.9zm-9 8.8l51.3 1.4-108.9 3zm5.8-.4l49.9-3.8.2.3 2.1 3.6.8 1.3zm51.3-3.9l5.2-.4 5.2.4-2 3.5-1.1 1.9h-4.1l-1.1-1.9zm9.4 4.1l2.1-3.6.2-.3 49.9 3.8-53.1 1.3zm58 .3l57.7 4.4-108.9-3zm-55.5-4.9l.3-.5 46-3.5 40.9 7.3-31.9.9zm48.7-4.2l25.8-2 28.2 9.1-12.5.3zm27.3-2.1l15.9-1.2 19.2 10.2-6.6.2zm17.1-1.3l10.2-.8 12.9 10.9h-3.8zm11.1-.8l7.7-.6 8.5 11.4h-3.4zm12.9 4l3.4 5.9-7.8-10.5h1.6v-.3zm-12.4-21.5l4.1 7.2 4.1 7.2 1.1 1.8h-1.8l-16.6-22.2 5-.9v-.3zm-20.7-35.8l4.1 7.2 4.1 7.2 4.1 7.2 4 6.9-5.2.9-19.6-26.2 8.6-2.7v-.3zM220 143.9l4.1 7.2 4.1 7.2 4.1 7.2 4 6.9-8.7 2.8-23.2-31 .8-1.4 10.7-5.7v-.3zm-4.3-7.4l-9.9 5.2.7-1.2 2.1-3.6 2.1-3.6 1.5-2.7zM195.2 101l4.1 7.2 4.1 7.2 4.1 7.2 4.1 7.2h-17.9l-17.2-23 14.8-12.5zm-28.9-50.1l4.1 7.2 4.1 7.2 4.1 7.2 4.1 7.2 4.1 7.2 4.1 7.1-.2-.2-14.8 12.5L146 65.9l16.3-21.8zm-33-14.3l4.1-7.2 4.1-7.2 4.1-7.2 4.1 7.2 4.1 7.2 4.1 7.2 4.1 7.2-.2-.2-16.2 21.8-16.2-21.8-.2.2zm-28.9 50.1l4.1-7.2 4.1-7.2 4.1-7.2 4.1-7.2 4.1-7.2 4-6.9 16.3 21.8-30.1 40.2-14.7-12.2v.2zm-20.7 35.8l4.1-7.2 4.1-7.2 4.1-7.2 4-6.9 14.8 12.5-17.2 23h-18zm-4.7 8.1l1.5 2.7 2.1 3.6 2.1 3.6.7 1.2-9.9-5.2zm-20.1 34.8l4.1-7.2 4.1-7.2 4.1-7.2 4-6.9 10.7 5.7.8 1.4-23.2 31-8.7-2.8zM42.4 194l4.1-7.2 4.1-7.2 4.1-7.1v.2l8.6 2.7-19.7 26.4-5.2-.9zm-16.5 28.6l4.1-7.2 4.1-7.2 4.1-7.1v.2l5 .9-16.6 22.4h-1.8zm-4.1 7.2l2.9-5v.3h1.6l-7.7 10.4zm5.1-4.6l7.7.6-12.9 10.9h-3.3zm-13.4 18.9zm2.4-4.2l2-2.7H21l-7.1 6zm6-2.6h3.5l-9.6 5.1zm4.7.1l6 .2-16 5.1zm7.8.2l11.3.3-27.9 5zm-15 5.6l29.3-5.2 29 .8zm118 .8h-113l118.2-3.3.9 1.6 1 1.7zm8.3-.5l-1.1-1.8-.6-1h3.3l-.6 1zm115.6.5H146.8l1-1.7.9-1.6 118.2 3.2zm-47.7-5.2l29-.8 29.3 5.2zm31.9-.8l11.3-.3 16.5 5.3zm13.1-.4l6-.2 10 5.3zm7.2-.2h3.5l6.1 5.2zm4.4-.1h3.1l2.2 2.7 1.9 3.3zm7.5 6.8z"/></g></svg>
  )
}

class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      screen: 0,
      splitText: undefined
    };
    this.toggleShape = this.toggleShape.bind(this);
  }
  
  componentDidMount() {
    var splitText = new SplitText(this.staggerP.childNodes, {type:"lines"});
    this.setState({
      splitText: splitText
    });
    TweenMax.set([this.g1, this.g2, this.g3, this.g4], {
      visibility: 'visible'
    })
    TweenMax.set(this.g1.childNodes, { drawSVG: "68% 100%" })
    TweenMax.set(this.g2.childNodes, { drawSVG: "33% 0%" })
    TweenMax.set(this.g3.childNodes, { drawSVG: "65% 100%" })
    TweenMax.set(this.g4.childNodes, { drawSVG: "67% 100%" })
    TweenMax.set(this.hero, {
      css:{
        transformPerspective:700, 
        perspective:400, 
        transformStyle:"preserve-3d"
      }
    });
    if (window.matchMedia("(max-width: 600px)").matches) {
      TweenMax.set(this.hero, {
        css:{
          transformPerspective:200, 
          perspective:200, 
          transformStyle:"preserve-3d"
        }
      });
    }
  }

  toggleShape() {
    if (this.state.screen === 0) {
      this.animFire(this.state.splitText);
    } else if (this.state.screen === 1) {
      this.animMap(this.state.splitText);
    } else if (this.state.screen === 2) {
      this.animBack();
    }
    this.setState({
      screen: (this.state.screen + 1) % 3
    });
  };

  animFire(splitText) {
    const tl = new TimelineMax,
          lines = splitText.lines,
          dur = 1.75,
          stD = 0.08,
          stA = 'start';
    
    TweenMax.set([this.g1.childNodes, this.g2.childNodes, this.g3.childNodes, this.g4.childNodes], {
      clearProps:'svgOrigin'
    });
    TweenMax.set([this.g1.childNodes, this.g2.childNodes, this.g3.childNodes, this.g4.childNodes], {
      y: -67
    });

    tl.add('start');
    tl.staggerFromTo(this.g1.childNodes, dur, {
      drawSVG: "68% 100%"
    }, {
      drawSVG: "27.75% 0%",
      ease: Back.easeOut
    }, stD, stA);
    tl.staggerFromTo(this.g2.childNodes, dur, {
      drawSVG: "33% 0%"
    }, {
      drawSVG: "71% 100%",
      ease: Back.easeOut
    }, stD, stA);
    tl.staggerFromTo(this.g3.childNodes, dur, {
      drawSVG: "65% 100%"
    }, {
      drawSVG: "30.5% 0%",
      ease: Back.easeOut
    }, stD, stA);
    tl.staggerFromTo(this.g4.childNodes, dur, {
      drawSVG: "67% 100%"
    }, {
      drawSVG: "28.5% 0%",
      ease: Back.easeOut
    }, stD, stA);
    tl.add( turn(this.g1), 'start+=2');
    tl.add( turn(this.g2), 'start+=2');
    tl.add( turn(this.g3), 'start+=2');
    tl.add( turn(this.g4), 'start+=2');
    tl.fromTo(this.crect, 0.5, {
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0
    }, {
      scaleX: 0.5,
      scaleY: 1.2,
      x: -35,
      y: -50,
      transformOrigin: '50% 50%',
      ease: Sine.easeInOut
    }, 'start+=2');
    tl.fromTo(this.shapes, 0.5, {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1
    }, {
      scale: 2,
      x: 0,
      opacity: 0.25,
      transformOrigin: '50% 50%',
      ease: Sine.easeInOut
    }, 'start+=2');
    if (window.matchMedia("(max-width: 600px)").matches) {
      tl.to(this.heroarea, 0.5, {
        x: -30,
        ease: Sine.easeInOut
      }, 'start+=2');
    }
    tl.to(this.hero, 0.5, {
      x: -125,
      y: 70,
      ease: Sine.easeInOut
    }, 'start+=2');
    tl.to(this.text, 0.5, {
      top: '30vh',
      x: -50,
      ease: Sine.easeInOut
    }, 'start+=2');
    tl.to(this.button, 0.5, {
      x: -112,
      ease: Sine.easeIn
    }, 'start+=2');
    tl.to(this.button.childNodes[0], 0.25, {
      opacity: 0,
      display: 'none',
      ease: Sine.easeIn
    }, 'start+=2');
    tl.to(this.button.childNodes[1], 0.25, {
      display: 'block',
      opacity: 1,
      ease: Sine.easeOut
    }, 'start+=2.25');
    tl.to(this.staggerP, 0.1, {
      opacity: 1,
    }, 'start+=2.5');
    tl.staggerFromTo(lines, 3, {
      opacity: 0
    }, {
      opacity: 1,
      ease: Sine.easeOut
    }, 0.06, 'start+=2.5');

    tl.timeScale(1.7);

    //helper for turning the rect
    function turn(group) {
      var tl1 = new TimelineMax();
      
      tl1.staggerFromTo(group.childNodes, 1.5, {
        rotation: 0,
        strokeWidth: 9,
      }, {
        rotation: 90,
        svgOrigin: '527.45 351.8',
        strokeWidth: 1,
        ease: Back.easeOut
      }, 0.05);

      return tl1;
    }
  }
  
  animBack() {
    const tl = new TimelineMax,
          dur = 1,
          stD = 0.1,
          stA = 'start3+=1';
    
    tl.add('start3');
    tl.to(this.hero, 0.5, {
      z: 0,
      rotationX: 0,
      y: 0,
      x: 0,
      ease: Sine.easeOut
    }, 'start3');
    tl.to(this.gray, 0.25, {
      autoAlpha: 1,
      ease: Sine.easeOut
    }, 'start3');
    tl.to(this.crect, 0.25, {
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      transformOrigin: '50% 50%',
      ease: Sine.easeOut
    }, 'start3');
     tl.to(this.button.childNodes[2], 0.25, {
      opacity: 0,
      display: 'none',
      ease: Sine.easeIn
    }, 'start3');
    tl.to(this.button.childNodes[0], 0.25, {
      display: 'block',
      opacity: 1,
      ease: Sine.easeOut
    }, 'start3+=0.25');
    tl.to(this.shapes, 0.5, {
      scaleX: 1,
      scaleY: 1,
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1,
      svgOrigin: '520 400',
      ease: Sine.easeInOut
    }, 'start3');
    tl.to(this.text, 0.5, {
      top: 'auto',
      x: 0,
      y: 0,
      ease: Sine.easeIn
    }, 'start3');
    tl.add( turnBack(this.g1), 'start3');
    tl.add( turnBack(this.g2), 'start3');
    tl.add( turnBack(this.g3), 'start3');
    tl.add( turnBack(this.g4), 'start3');
    tl.staggerTo(this.g1.childNodes, dur, { 
      drawSVG: "68% 100%",
      ease: Back.easeOut
    }, stD, stA);
    tl.staggerTo(this.g2.childNodes, dur, { 
      drawSVG: "33% 0%",
      ease: Back.easeOut
    }, stD, stA);
    tl.staggerTo(this.g3.childNodes, dur, { 
      drawSVG: "65% 100%",
      ease: Back.easeOut
    }, stD, stA);
    tl.staggerTo(this.g4.childNodes, dur, { 
      drawSVG: "67% 100%",
      ease: Back.easeOut
    }, stD, stA);
    
    //helper for returning
    function turnBack(group) {
      let tl3 = new TimelineMax();
      
      tl3.staggerTo(group.childNodes, 0.8, {
        rotation: 0,
        strokeWidth: 9,
        scaleX: 1,
        scaleY: 1,
        svgOrigin: '527.45 351.8',
        ease: Back.easeOut
      }, 0.05);
      
      return tl3;
    }
  }
  
  animMap(splitText) {
    const tl = new TimelineMax,
          lines = splitText.lines;

    tl.add('start2');
    tl.to(this.hero, 0.5, {
      z: 20,
      rotationX: 70,
      y: 100,
      x: 40,
      ease: Sine.easeOut
    }, 'start2');
    tl.to(this.gray, 0.25, {
      autoAlpha: 0,
      ease: Sine.easeOut
    }, 'start2');
    tl.to(this.crect, 0.25, {
      scaleX: 1,
      scaleY: 0.75,
      transformOrigin: '50% 50%',
      ease: Sine.easeOut
    }, 'start2');
    tl.add( scaleUp(this.g1), 'start2');
    tl.add( scaleUp(this.g2), 'start2');
    tl.add( scaleUp(this.g3), 'start2');
    tl.add( scaleUp(this.g4), 'start2');
    tl.to(this.text, 0.5, {
      top: '20vh',
      x: 0,
      ease: Sine.easeIn
    }, 'start2');
    tl.to(this.shapes, 0.5, {
      opacity: 0.75,
      ease: Sine.easeOut
    }, 'start2');
    tl.to(this.button, 0.3, {
      x: 0,
      ease: Sine.easeOut
    }, 'start2');
    tl.to(this.button.childNodes[1], 0.25, {
      opacity: 0,
      display: 'none',
      ease: Sine.easeIn
    }, 'start2');
    tl.to(this.button.childNodes[2], 0.25, {
      display: 'block',
      opacity: 1,
      ease: Sine.easeOut
    }, 'start2+=0.25');
    if (window.matchMedia("(max-width: 600px)").matches) {
      tl.to(this.heroarea, 0.5, {
        x: -150,
        ease: Sine.easeOut
      }, 'start2+=0.5');
      tl.to(this.text, 0.5, {
        y: 100,
        ease: Sine.easeOut
      }, 'start2');
    }
    tl.staggerTo(lines, 0.4, {
      opacity: 0,
      ease: Sine.easeOut
    }, 0.03, 'start2+=0.8');
    
    function scaleUp(group) {
      let tl2 = new TimelineMax();
      
      tl2.staggerTo(group.childNodes, 1, {
        scaleX: 0.93,
        scaleY: 2.22,
        strokeWidth: 5,
        svgOrigin: '493 351.8',
        ease: Sine.easeOut
      }, 0.05);

      return tl2;
    }
  }

  render() {

    return (
      <div className="hero-area" ref={c => this.heroarea = c}>
        <svg className="hero" ref={c => this.hero = c} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1054.9 703.6">
          <defs>
            <clipPath id="clip-path" transform="translate(0 -67)">
              <rect id="crect" ref={c => this.crect = c} x="25.6" y="175" width="1011.3" height="550" fill="none"/>
            </clipPath>
          </defs>
          <title>change-shape2</title>
          <g style={{clipPath:'url(#clip-path)'}}>
            <image ref={c => this.map = c} width="1000" height="667" transform="scale(1.05)" xlinkHref="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/persp-map.gif"/>
            <image className="gray" ref={c => this.gray = c} width="1000" height="667" transform="scale(1.05)" xlinkHref="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/blog-hero2.jpg"/>
          </g>
          <rect id="square" x="417.9" y="268.9" width="217" height="217" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="9"/>
          <polygon id="triangle" points="525.6 271.6 650 487 401.2 487 525.6 271.6" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="9"/>
          <g id="shapes" ref={c => this.shapes = c}>
            <g id="g4" ref={c => this.g4 = c}>
              <path d="M417.9,335.9v249s1,54-62,51-53-74.4,12-80c27.2-2.3,33.3-1.9,33.3-1.9H650" transform="translate(0 -67)" fill="none" stroke="#3953a4" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M417.9,335.9v249s1,54-62,51-53-74.4,12-80c27.2-2.3,33.3-1.9,33.3-1.9H650" transform="translate(0 -67)" fill="none" stroke="#6abd45" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M417.9,335.9v249s1,54-62,51-53-74.4,12-80c27.2-2.3,33.3-1.9,33.3-1.9H650" transform="translate(0 -67)" fill="none" stroke="#ed2024" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
            </g>
            <g id="g3" ref={c => this.g3 = c}>
              <path d="M634.9,552.9v-217s10.5-84-61.5-83.5c-70.1.5-60.1,64.4-47.8,86.2S650,554,650,554" transform="translate(0 -67)" fill="none" stroke="#3953a4" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M634.9,552.9v-217s10.5-84-61.5-83.5c-70.1.5-60.1,64.4-47.8,86.2S650,554,650,554" transform="translate(0 -67)" fill="none" stroke="#6abd45" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M634.9,552.9v-217s10.5-84-61.5-83.5c-70.1.5-60.1,64.4-47.8,86.2S650,554,650,554" transform="translate(0 -67)" fill="none" stroke="#ed2024" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
            </g>
            <g id="g2" ref={c => this.g2 = c}>
              <path d="M525.6,338.6,647.4,546.4l5,6.5c-44,16.5-8,60-8,60,39,51.5,63.5.5,63.5.5,32.5-72-40.1-59.8-61.2-60.1-7-.1-11.8-.4-11.8-.4h-217" transform="translate(0 -67)" fill="none" stroke="#3953a4" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M525.6,338.6,647.4,546.4l5,6.5c-44,16.5-8,60-8,60,39,51.5,63.5.5,63.5.5,32.5-72-40.1-59.8-61.2-60.1-7-.1-11.8-.4-11.8-.4h-217" transform="translate(0 -67)" fill="none" stroke="#6abd45" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M525.6,338.6,647.4,546.4l5,6.5c-44,16.5-8,60-8,60,39,51.5,63.5.5,63.5.5,32.5-72-40.1-59.8-61.2-60.1-7-.1-11.8-.4-11.8-.4h-217" transform="translate(0 -67)" fill="none" stroke="#ed2024" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
            </g>
            <g id="g1" ref={c => this.g1 = c}>
              <path d="M634.9,335.9h-217s-57,6-56-58.5c1.1-71,162,37.5,162,37.5s12.9,4.4,1.7,23.7L401.2,554" transform="translate(0 -67)" fill="none" stroke="#3953a4" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M634.9,335.9h-217s-57,6-56-58.5c1.1-71,162,37.5,162,37.5s12.9,4.4,1.7,23.7L401.2,554" transform="translate(0 -67)" fill="none" stroke="#6abd45" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
              <path d="M634.9,335.9h-217s-57,6-56-58.5c1.1-71,162,37.5,162,37.5s12.9,4.4,1.7,23.7L401.2,554" transform="translate(0 -67)" fill="none" stroke="#ed2024" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"/>
            </g>
          </g>
        </svg>
      
      <div className="textarea" ref={c => this.text = c}>
        <h1>Lorem Ipsum.</h1>
        <button className="button" ref={c => this.button = c} onClick={this.toggleShape}>
          <span className="read">Read More ></span>
          <span className="share"><IconMap /> See Map</span>
          <span className="home">Return Home</span>
        </button>
        <div className="staggerP" ref={c => this.staggerP = c}>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam illum repellendus, molestiae excepturi quo, ab possimus perspiciatis sunt quis. Magni impedit hic culpa, ea. Praesentium facilis dicta excepturi magnam perferendis?</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam illum repellendus, molestiae excepturi quo, ab possimus perspiciatis sunt quis. Magni impedit hic culpa, ea. Praesentium facilis dicta excepturi magnam perferendis?</p>
        </div>
      </div>
    </div>
    );
  }
};

//IconBrand
function IconBrand(props) {
  //props and default props
  const fillColor = props.fillColor || 'white'

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="iconBrand"><path fill={fillColor} d="M44.783,19.518L5,67.033l15.383,13.449L95,71.982L44.783,19.518z M64.392,65.044l-7.251-1.506l-1.406-5.072l3.979-4.149  l5.482,6.043L64.392,65.044z M65.828,61.054l4.793,5.284l-5.504-1.144L65.828,61.054z M43.445,64.301l-2.706-6.549l3.092-3.549  l3.758,4.174l-1.586,5.768L43.445,64.301z M45.797,64.899l-0.841,3.059l-1.212-2.933L45.797,64.899z M44.321,53.641L51,45.974  L47.823,57.53L44.321,53.641z M43.822,53.087l-6.638-7.372h13.06L43.822,53.087z M43.332,53.649l-2.909,3.339l-4.657-11.273h0.421  L43.332,53.649z M35.461,44.974l-0.052-0.125l0.112,0.125H35.461z M35.342,44.775l-0.066,0.027l0.028-0.07L35.342,44.775z   M34.904,45.715h0.062l4.915,11.897l-2.287,2.626l-5.917-6.611L34.904,45.715z M31.127,53.013l-1.605-1.793l4.332-4.891  L31.127,53.013z M37.103,60.799l-3.398,3.9l-3.572-7.293l1.232-3.019L37.103,60.799z M37.6,61.355l2.803,3.132l-5.842,0.357  L37.6,61.355z M38.09,60.793l2.106-2.417l2.468,5.973l-1.319,0.081L38.09,60.793z M42.962,65.072l0.894,2.164l-1.883-2.104  L42.962,65.072z M46.578,64.851l2.133-0.13l-2.94,3.065L46.578,64.851z M46.785,64.097l1.393-5.067l2.901,3.221l-1.614,1.682  L46.785,64.097z M48.411,58.183l3.226-11.735l3.273,11.809l-3.318,3.459L48.411,58.183z M52.329,46.174l6.887,7.592l-3.711,3.869  L52.329,46.174z M52.88,45.68l14.457-0.382l-7.608,7.933L52.88,45.68z M50.889,44.974H36.517l-0.386-0.428l14.837,0.336  L50.889,44.974z M29.025,50.664l-4.336-4.845l8.707-0.09L29.025,50.664z M28.531,51.222l-0.919,1.037L25.379,47.7L28.531,51.222z   M29.028,51.777l1.788,1.998l-1.119,2.742l-1.733-3.539L29.028,51.777z M29.323,57.435l-3.233,7.926l-9.612,0.587l10.956-12.37  L29.323,57.435z M29.759,58.325l3.239,6.614l-6.089,0.372L29.759,58.325z M41.032,65.189l2.799,3.128l-8.493-2.78L41.032,65.189z   M49.8,64.654l3.263-0.199l2.959,3.287l-9.9,0.748L49.8,64.654z M50.555,63.867l1.021-1.064l0.855,0.95L50.555,63.867z   M52.089,62.268l3.051-3.181l1.227,4.426l-2.992,0.183L52.089,62.268z M60.228,53.78l7.43-7.748l-2.303,13.401L60.228,53.78z   M52.224,44.957l-0.042-0.047l0.972,0.022L52.224,44.957z M35.685,43.799l9.062-22.213l6.252,22.559L35.685,43.799z M34.057,44.982  l-3.043,0.032l3.354-0.383L34.057,44.982z M23.906,46.375l3.176,6.484l-11.65,13.153l-1.298,0.079l9.589-19.498L23.906,46.375z   M14.738,66.795l-2.137,2.412l1.157-2.353L14.738,66.795z M15.784,66.731l9.996-0.61l-1.644,4.029L11.94,71.071L15.784,66.731z   M26.6,66.071l6.833-0.417l0.07,0.061l9.252,3.029l-17.795,1.344L26.6,66.071z M56.648,68.437l5.205,5.781l-15.322-5.016  L56.648,68.437z M57.58,68.367l6.322-0.478l-1.082,6.297L57.58,68.367z M56.954,67.671l-2.948-3.274l2.811-0.172l7.449,1.548  l-0.234,1.363L56.954,67.671z M64.991,65.924l4.025,0.836l-4.223,0.319L64.991,65.924z M65.987,60.129l2.223-12.938l2.894,18.579  L65.987,60.129z M51.771,44.162l-6.069-21.9l21.291,22.243L51.771,44.162z M34.873,43.831l-9.769,1.114L43.27,23.247L34.873,43.831z   M13.284,66.143l-6.249,0.382l14.688-17.544L13.284,66.143z M12.909,66.907l-1.858,3.778l-3.918-3.426L12.909,66.907z   M23.823,70.917l-3.288,8.06l-8.225-7.191L23.823,70.917z M24.648,70.854l19.951-1.507l16.167,5.293l-39.498,4.5L24.648,70.854z   M64.663,67.832l6.974-0.527l18.952,3.938l-27.041,3.081L64.663,67.832z M71.984,66.621L68.84,46.436l23.336,24.38L71.984,66.621z"></path></svg>
  )
}

//IconMap
function IconMap(props) {
  //props and default props
  const fillColor = props.fillColor || 'currentColor'

  return (
    <svg className="iconMap" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 100 100"><path fill={fillColor}  d="M81.4,40.6C80.3,23.7,66.5,10.5,50,10.5S19.7,23.7,18.6,40.6c-0.3,4.3,0.3,8.6,1.9,12.8c1.5,4,3.9,7.9,7.1,11.3l20.5,23.9  c0.5,0.6,1.2,0.9,1.9,0.9s1.4-0.3,1.9-0.9l20.5-23.9c3.2-3.5,5.6-7.3,7.1-11.3C81,49.2,81.7,44.9,81.4,40.6z M50,50.5  c-5.3,0-9.7-4.5-9.7-10s4.3-10,9.7-10s9.7,4.5,9.7,10S55.3,50.5,50,50.5z"></path></svg>
  )
}

//Bookmark
function Bookmark(props) {

  return (
    <div className="bookmark">
      <span>Bookmark this page</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 64 64"><path fill="white" d="M52,3H12c-0.6,0-1,0.4-1,1v56c0,0.4,0.2,0.7,0.5,0.9s0.7,0.2,1,0L32,49.2l19.5,11.7C51.6,61,51.8,61,52,61s0.3,0,0.5-0.1  c0.3-0.2,0.5-0.5,0.5-0.9V4C53,3.4,52.6,3,52,3z"></path></svg> 
  </div>
  )
}

//Search
function Search(props) {
  //props and default props
  const fillColor = props.fillColor || 'white'

  return (
    <div className="search">
      <span className="searchtext">Search</span> 
      <svg className="searchicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" ><path fill={fillColor}  d="M64.4,59.5L52.5,47.6c4.1-5.2,6.3-11.5,6.3-18c0-16.1-13.1-29.2-29.2-29.2S0.5,13.6,0.5,29.7s13.1,29.2,29.2,29.2  c6.5,0,12.9-2.2,18-6.3l11.9,11.9c0.7,0.7,1.5,1,2.4,1s1.7-0.3,2.4-1C65.8,63,65.8,60.9,64.4,59.5z M51.8,29.8  C51.8,42,41.9,52,29.7,52S7.5,42,7.5,29.8S17.4,7.6,29.7,7.6S51.8,17.5,51.8,29.8z"></path></svg>
  </div>
  )
}

class App extends React.Component {

  render() {
    return (
      <div className="external">
        
        <Watermark />
        
        <header>
          <IconBrand />
          <Search />
          <Bookmark />
        </header>

        <Page />
           
      </div>
    );
  };
}

ReactDOM.render(<App />, document.querySelector("#container"));