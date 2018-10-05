// LOL pen by beatrize

var tl = new TimelineMax({ repeat: -1, timeDelay: 0.1 });

tl.staggerTo(["#pumpkin", "#witch", "#ghost"], 0.5, { x: 0 }, 0, 0.1)
  .staggerTo(
    ["#pumpkin", "#witch", "#ghost"],
    1,
    { ease: Elastic.easeOut.config(0.5, 0.5), x: 1000 },
    0.2
  )
  .staggerTo(
    ["#pumpkin-lid", "#witch-lid", "#ghost-lid"],
    0.5,
    { y: -85, rotation: 10, transformOrigin: "left 50%" },
    0.2,
    1.3
  )
  .staggerTo(
    ["#lollipop", "#green-candy", "#red-candy", "#purple-candy", ".candy"],
    0.5,
    { y: -60, ease: Circ.easeOut },
    0.1,
    1.4
  )
  .staggerTo(".green-witch", 1, { x: -140, y: -140, ease: Expo.easeOut }, 0, 2)
  .staggerTo(
    ".ghost1",
    2,
    {
      x: 0,
      y: -480,
      scale: 1.5,
      transformOrigin: "center",
      ease: Circ.easeOut
    },
    0,
    2.3
  )
  .staggerTo(
    ".ghost2",
    0.6,
    {
      x: -90,
      y: -250,
      scale: 1.2,
      transformOrigin: "center",
      ease: Circ.easeOut
    },
    0,
    2.3
  )
  .staggerTo(
    ".ghost3",
    1,
    {
      x: 90,
      y: -220,
      scale: 1.2,
      transformOrigin: "center",
      ease: Circ.easeOut
    },
    0,
    2.3
  )
  .staggerTo([".ghost1", ".ghost2", ".ghost3"], 1.5, { opacity: 0 }, 0, 2.65)
  .staggerTo(
    [
      ".star8",
      ".star7",
      ".star6",
      ".star5",
      ".star4",
      ".star3",
      ".star2",
      ".star1"
    ],
    0.01,
    { opacity: 1 },
    0.03,
    2.15
  )
  .staggerTo(".green-witch", 1, { opacity: 0 }, 0, 2.3)
  .staggerTo(
    ["#red-candy", "#lollipop", "#green-candy", "#purple-candy"],
    2.5,
    { rotationZ: 360, transformOrigin: "50% 50%", ease: Circ.easeOut },
    0.1,
    1.6
  )
  .staggerTo(
    ["#lollipop", "#green-candy", "#red-candy", "#purple-candy", ".candy"],
    1,
    { y: 0, ease: Circ.easeInOut },
    0,
    2.6
  )
  .staggerTo(
    [
      ".star8",
      ".star7",
      ".star6",
      ".star5",
      ".star4",
      ".star3",
      ".star2",
      ".star1"
    ],
    0.01,
    { opacity: 0.5 },
    0.05,
    2.17
  )
  .staggerTo(
    [
      ".star8",
      ".star7",
      ".star6",
      ".star5",
      ".star4",
      ".star3",
      ".star2",
      ".star1"
    ],
    0.05,
    { opacity: 0, ease: Circ.easeOut },
    0.05,
    2.28
  )
  .staggerTo(
    ["#pumpkin-lid", "#witch-lid", "#ghost-lid"],
    0.5,
    { y: 0, rotation: 0, transformOrigin: "left 50%", ease: Power4.easeInOut },
    0.2,
    3.0
  )
  .staggerTo(
    ["#pumpkin-lid", "#witch-lid", "#ghost-lid"],
    0.1,
    { rotation: 0, ease: Power4.easeIn, transformOrigin: "left 100%" },
    0.1
  )
  .staggerTo(["#ghost", "#witch", "#pumpkin"], 0.5, { x: 2000 }, 0.1, 4);
