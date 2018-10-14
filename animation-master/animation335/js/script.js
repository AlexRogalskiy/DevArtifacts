const { h, app } = hyperapp

const main = (p,c) => h('main', p, c)
const img = (p,c) => h('img', p)
const h1 = (p,c) => h('h1', p, c)
const span = (p,c) => h('span', p, c)
const button = (p,c) => h('button', p, c)
const progress = (p,c) => h('progress', p, c)

const NOW = () => (new Date()).getTime()

const REQUEST_COUNT = 50

app({
  state: {
     requestCount: 0,
     totalTime: 0,
     responses: [],
  },
  actions: {
     reset: (s,a,d) => ({
        requestCount: 0,
        totalTime: 0,
        responses: [],
     }),
     loaded: (s,a,d) => {
       const timeTaken = NOW() - d.split('t=')[1]
       if(s.requestCount < REQUEST_COUNT) return {
         totalTime: s.totalTime + timeTaken,
         requestCount: s.requestCount + 1,
         responses: s.responses.concat(timeTaken),
       }
     }
  },
  events: {},
  view: (s,a) =>
    main({},[
      h1({ disabled: s.requestCount !== REQUEST_COUNT },
        s.requestCount && Math.floor(s.totalTime / s.requestCount)
      ),
      span({}, `MILLISECOND AVG OVER ${s.requestCount} REQUESTS`),
      progress({ value: s.requestCount, max: REQUEST_COUNT, disabled: s.requestCount === REQUEST_COUNT }),
      button({ onclick: a.reset, disabled: s.requestCount !== REQUEST_COUNT }, 'TEST MY PING'),
      img({
         onload: e => a.loaded(e.target.src),
         src: 'https://www.google.co.uk/images/branding/googlelogo/1x/googlelogo_color_120x44dp.png?c=' + s.requestCount + 't=' + NOW(),
      }),
    ])
})
