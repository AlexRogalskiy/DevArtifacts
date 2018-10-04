console.clear()
const OFFSET = 4
const CONTAINER = document.querySelector('main')
const TOGGLE = document.querySelector('#toggle')
const TEMPO = document.querySelector('#tempo')
const TEMPO_VALUE = document.querySelector('#tempo-value')

document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});


// container for Tone.js synths containing basic FX and synth configuration
class Instrument {
  constructor(params) {
    this.buildSynth()
    this.fader.connect(params.hall)
    this.gain.connect(this.fader, 0, 0)
    this.solo.connect(this.fader, 0, 1)
    this.makeSolo = this.makeSolo
    this.makeBG = this.makeBG
  }  
  
  makeSolo() {
    this.synth = this.synth2
    this.fadeIn()
  }
  
  makeBG(octave) {
    this.gain.gain.value = (octave === 2) ? 0.4 : 0.25;
    this.synth = this.synth1
    this.fadeOut()
  }
  
  fadeIn() {
    window.requestAnimationFrame(() => {
      this.fader.fade.value += 0.05
      if(this.fader.fade.value < 1) this.fadeIn();
    })
  }
  
  fadeOut() {
    window.requestAnimationFrame(() => {
      this.fader.fade.value -= 0.05
      if(this.fader.fade.value > 0) this.fadeOut();
    })
  }
  
  buildSynth() {
    this.synth1 = new Tone.FMSynth()
    this.synth2 = new Tone.FMSynth()
    this.synth = this.synth1
    this.gain = new Tone.Gain(0.3)
    this.solo = new Tone.Gain(0.4)
    this.fader = new Tone.CrossFade(0);
    
    this.pan = new Tone.Panner(0).connect(this.gain)
    let delay = new Tone.PingPongDelay('16n', 0.2).connect(this.solo)
    delay.wet.value = 0.2
    this.synth2.connect(delay)
    this.synth1.connect(this.pan)
    this.configSynth(this.config('inst'), this.synth1)
    this.configSynth(this.config('solo'), this.synth2)
  }
  
  configSynth(config, synth) {
    let wave1 = config.wave1 || 'triangle'
    let wave2 = config.wave2 || wave1
    let attack = config.attack || 0.01
    let decay = config.decay || 0.2
    let sustain = config.sustain || 0.5
    let release = config.release || 0.5
    let harmonicity = config.harmonicity || 1
    let mod = config.modulation || 4
    synth.modulationIndex.value = mod
    synth.harmonicity.value = harmonicity
    synth.oscillator.type = wave1
    synth.envelope.attack = attack
    synth.envelope.decay = decay
    synth.envelope.sustain = sustain
    synth.envelope.release = release
    synth.modulation.type = wave2
    synth.modulationEnvelope.attack = attack * 1.4
    synth.modulationEnvelope.decay = decay
    synth.modulationEnvelope.sustain = sustain
    synth.modulationEnvelope.release = release
  }
  
  config(name) {
    return {
      inst: { wave1: 'triangle', wave2: 'sawtooth', attack: 0.01, harmonicity: 1, modulation: 10 },
      solo: { wave1: 'triangle', wave2: 'sine', attack: 0.01, harmonicity: 2, modulation: 4 },
    }[name]
  }
}



// all logic for holding and switching notes 
// as well as visualization of the part for the score
class Part {
  constructor(params) {
    this.scale = params.scale
    this.music = params.music
    this.steps = params.steps
    this.meter = params.meter
    this.tick = this.tick
    this.setupSheet()
    this.initValues()
  }
  
  initValues() {
    this.master_step = 0
    this.hold = 0
    this.step = 0
    this.note = 0
    this.loops = 1
    this.started = false
    this.current = { notation: null, note: null, res: null, len: null }
    this.current.note = this.music.notes[this.note]
    this.last = { notation: null }
    this.loops_el.innerHTML = ''
    let last = this.scale.notes[this.music.last]
    let notation = last.note
    notation += 3 + last.rel_octave
    this.last.notation = notation
  }
  
  tick() {
    this.master_step++
    // waiting to play
    if(!this.started) {
      this.hold++
      if(this.hold >= this.music.start) {
        this.hold = 0
        this.started = true
        this.generateNotation()
        this.sheet.className = 'note-0'
        this.loops_el.innerHTML = this.loops
      }
      return { play: false }
    // can play
    } else {
      let play = { play: false }
      if(this.hold === 0) play = { play: true };
      this.hold++
      if(this.step === this.steps) this.step = 0;
      this.sheet.setAttribute('data-step', this.step)
      if(this.hold === this.current.note.res) {
        this.noteChange()
        if(this.master_step === this.music.drummer) play = { play: true, drummer: true, solo: true }
      }
      // solo fires one step ahead of drummer switch
      if(this.master_step + 1 === this.music.drummer) play.solo = true;
      this.step++
      return play
    }
  }
  
  noteChange() {
    this.hold = 0
    this.note++
    if(this.note === this.music.notes.length) {
      // helpful for determining drum starts
      // if(this.meter === '7/8' && this.master_step > 1100) console.log('7/8', this.master_step);
      // if(this.meter === '4/4' && this.master_step > 1100) console.log('4/4', this.master_step, this.music.drummer); 
      // loop
      this.note = 0
      this.loops++
      this.loops_el.innerHTML = this.loops
    }
    this.sheet.className = `note-${this.note}`
    this.current.note = this.music.notes[this.note]
    this.generateNotation()
  }
  
  generateNotation() {
    let note = this.scale.notes[this.current.note.step]
    let notation = note.note
    notation += this.current.note.oct + this.music.octave + note.rel_octave
    this.current.notation = notation
  }
  
  setupSheet() {
    this.sheet = document.createElement('section')
    this.sheet.setAttribute('data-octave', this.music.octave)
    this.sheet.setAttribute('data-steps', this.steps)
    this.sheet.setAttribute('data-step', '')
    this.loops_el = document.createElement('span')
    this.meter_el = document.createElement('span')
    this.meter_el.classList.add('meter')
    this.meter_el.innerHTML = this.meter
    this.music.notes.forEach(note => {
      let el = document.createElement('div')
      el.setAttribute('data-note', note.oct * 8 + note.step)
      el.setAttribute('data-res', note.res)
      this.sheet.appendChild(el)
    })
    this.sheet.appendChild(this.loops_el)
    this.sheet.appendChild(this.meter_el)
    CONTAINER.appendChild(this.sheet)
  }
}



// generates parts for orchestra
class Score {
  constructor(params) {
    this.scale = new MusicalScale({ key: 'C#', mode: 'locrian' })
    this.resolution = 16
    this.parts = this.generateParts(params.score)
    this.parts_keys = Object.keys(this.parts)
  }
  
  generateParts(score) {
    let parts = []
    // for each item in base score
    Object.keys(score).forEach(meter => {
      let total_steps = 0
      let music = score[meter]
      music.start = music.start * (this.resolution / 4)
      // for each note we need to generate its length in terms of resolution
      music.notes.forEach(note => {
        // how many resolution ticks in this note
        let res = 0
        // if it is an array, it is combining two values eg. `4n + 8n`
        if(note.len.match(/ \+ /)) {
          let split = note.len.split(' + ')
          // for each in the array, add the length
          split.forEach((i) => { res += this.resFromNoteLength(i) })
        } else {
          // get the res length on the item
          res = this.resFromNoteLength(note.len)
        }
        // set the resolution length
        note.res = res
        total_steps += res
      })
      let new_part = new Part({ meter: meter, scale: this.scale, music: music, steps: total_steps })
      parts.push(new_part)
    })
    return parts
  }
  
  resFromNoteLength(len) {
    let int = parseInt(len.replace('n', ''))
    return this.resolution / int
  }
}



// conductor makes players play
class Conductor {
  constructor(params) {
    this.initValues()
    this.tick = params.tick
    this.resolution = params.resolution
    this.updateTempo = this.updateTempo
    this.tempo = params.tempo
    TEMPO.value = this.tempo
    this.setTransport()
    this.start = this.start
    this.stop = this.stop
    this.end_step = (420 + OFFSET) * (this.resolution / 4)
    this.onComplete = params.onComplete
    this.updateTempo(this.tempo)
  }
  
  initValues() {
    this.step = 0
    this.playing = false
  }
  
  start() {
    this.transport.start()
    this.playing = true
    document.body.className = 'playing'
  }
  
  stop() {
    this.transport.stop()
    this.playing = false
    document.body.className = ''
  }
  
  toggle() {
    if(this.playing) {
      this.stop()
    } else {
      this.start()
    }
  }
  
  updateTempo(value) {
    this.tempo = value
    this.transport.bpm.value = value
    TEMPO_VALUE.innerHTML = value
  }
  
  setTransport() {
    this.transport = Tone.Transport
    this.transport.scheduleRepeat((time) => {
      this.tick(time)
      this.step++
      if(this.step === this.end_step) {
        this.stop()
        this.onComplete(time)
      }
    }, this.resolution + 'n')
  } 
}



// orchestra member that plays music
class Player {
  constructor(params) {
    let part = params.part
    this.instrument = new Instrument({ 
      hall: params.hall 
    })
    this.signalDrummer = params.signalDrummer
    this.signalSolo = params.signalSolo
    this.part = params.part
    this.tick = this.tick
  }
  
  tick(time) {
    let part_notification = this.part.tick()
    if(part_notification.solo) this.signalSolo(this.part.meter)
    if(part_notification.play) {
      if(part_notification.drummer) this.signalDrummer(this.part.meter);
      this.instrument.synth.triggerAttackRelease(this.part.current.notation, this.part.current.note.len + ' - 32n', time)
      // if(part_notification.stop) {
        // this.instrument.triggerRelease(time)  
      // }
    }
  }
}



// funky drummer
class Drummer {
  constructor(params) {
    this.setKit(params)
    this.patterns = new BasePatterns()
    this.updateMeter('2/4')
    this.updateMeter = this.updateMeter
    this.tick = this.tick
    this.initValues()
  }
  
  initValues() {
    this.step = 0
  }
  
  tick(time) {
    if(this.loaded.kd) {
      this.pattern.kd.forEach(pattern => {
        if((this.step + pattern.offset) % pattern.every === 0) this.kit.kd.triggerAttack(0, time);
      })
    }
    if(this.loaded.sd) {
      this.pattern.sd.forEach(pattern => {
        if((this.step + pattern.offset) % pattern.every === 0) this.kit.sd.triggerAttack(24, time);
      })
    }
    if(this.loaded.ch) {
      this.pattern.ch.forEach(pattern => {
        if((this.step + pattern.offset) % pattern.every === 0) this.kit.ch.triggerAttack(48, time);
      })
    }
    this.step++
  }
  
  updateMeter(meter) {
    this.step = 0
    this.pattern = this.patterns[meter]
  }
  
  setKit(params) {
    this.loaded = {}
    let samples = {
      kd: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/111863/kd-808.wav',
      sd: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/111863/kd-808.wav',
      ch: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/111863/kd-808.wav'
    }
    this.gain = new Tone.Gain(1)
    this.gain.connect(params.hall)
    let verb = new Tone.Freeverb()
    verb.roomSize.value = 0.3
    verb.wet.value = 0.1
    verb.connect(this.gain)
    this.slots = {
      kd: new Tone.Gain(0.6).connect(this.gain),
      sd: new Tone.Gain(0.5).connect(this.gain),
      ch: new Tone.Gain(0.35).connect(verb),
    }
    this.kit = {
      kd: new Tone.Sampler(samples.kd, () => { this.loaded.kd = true }).connect(this.slots.kd),
      sd: new Tone.Sampler(samples.sd, () => { this.loaded.sd = true }).connect(this.slots.sd),
      ch: new Tone.Sampler(samples.ch, () => { this.loaded.ch = true }).connect(this.slots.ch),
    }
    this.kit_keys = Object.keys(this.kit)
  }
}



// contains score, basic instrumentation, the players, and the conductor
class Orchestra {
  constructor(params) {
    this.hall = params.hall
    this.score = new Score({ score: new BaseScore() })
    this.setPlayers()
    this.solo_base = 0
    this.conductor = new Conductor({ 
      tempo: 140,
      resolution: this.score.resolution, 
      tick: (time) => { this.tick(time) },
      onComplete: (time) => {
        this.conductor.initValues()
        this.drummer.initValues()
        this.players.forEach(player => { 
          player.instrument.synth.triggerRelease(time)
          player.instrument.synth.triggerAttackRelease(player.part.last.notation, '1n + 1n', time)
          player.part.sheet.className = 'complete'
          player.part.sheet.setAttribute('data-solo', 'false')
          player.part.sheet.setAttribute('data-step', '')
          player.part.initValues()
        })
        this.signalDrummer('2/4')
        this.signalSolo('2/4')
      }
    })
    this.signalDrummer('2/4')
    this.signalSolo('2/4')
  }
  
  tick(time) {
    this.drummer.tick(time)
    this.players.forEach(player => { player.tick(time) })
  }
  
  setPlayers() {
    this.drummer = new Drummer({
      hall: this.hall
    })
    this.players = []
    for(let p = 0; p < this.score.parts_keys.length; p++) {
      this.players[p] = new Player({ 
        hall: this.hall,
        part: this.score.parts[this.score.parts_keys[p]],
        signalSolo: (meter) => {
          this.signalSolo(meter)
        },
        signalDrummer: (meter) => {
          this.signalDrummer(meter) 
        }
      })
    }
  }
  
  signalSolo(meter) {
    let off_i = this.solo_base
    let pans = [-0.7, 1, -1, 0.7]
    let octs = [2, 3, 3, 2]
    this.players.forEach((player, i) => {
      if(player.part.meter === meter) {
        player.instrument.makeSolo()
        player.part.music.octave = 5
        player.part.sheet.setAttribute('data-solo', 'true')
      } else {
        let octave = octs[off_i % 4]
        player.instrument.makeBG(octave)
        player.part.music.octave = octave
        player.instrument.pan.pan.value = pans[off_i % 4]
        player.part.sheet.setAttribute('data-solo', 'false')
        off_i++;
      }
    })
    this.solo_base++
  }
  
  signalDrummer(meter) {
    this.drummer.updateMeter(meter)
  }
}



// contains an orchestra and the hall
class Performance {
  constructor() {
    let gain = new Tone.Gain(1)
    gain.toMaster()

    this.hall = gain

    this.orchestra = new Orchestra({ hall: this.hall })
    
    TOGGLE.addEventListener('click', (e) => {
      this.orchestra.conductor.toggle()
    })
    
    TEMPO.addEventListener('change', (e) => {
      let value = parseInt(e.target.value)
      this.orchestra.conductor.updateTempo(value)
    })
  }
}


let app = new Performance()



function BasePatterns() {
  return {
    '2/4': {
      kd: [
        { every: 8, offset: 0 }
      ],
      sd: [
        { every: 8, offset: 4 }
      ],
      ch: [
        { every: 2, offset: 0 },
        { every: 8, offset: 1 }
      ],
    },
    '3/4': {
      kd: [
        { every: 12, offset: 12 }
      ],
      sd: [
        { every: 12, offset: 4 },
        { every: 12, offset: 8 }
      ],
      ch: [
        { every: 2, offset: 0 },
        { every: 13, offset: 1 }
      ],
    },
    '7/8': {
      kd: [
        { every: 14, offset: 14 },
        { every: 14, offset: 12 }
      ],
      sd: [
        { every: 14, offset: 4 },
        { every: 14, offset: 8 }
      ],
      ch: [
        { every: 2, offset: 0 },
        { every: 14, offset: 1 }
      ],
    },
    '4/4': {
      kd: [
        { every: 16, offset: 0 }
      ],
      sd: [
        { every: 16, offset: 8 },
        { every: 32, offset: 4 },
      ],
      ch: [
        { every: 2, offset: 0 },
        { every: 16, offset: 1 }
      ],
    },
    '5/4': {
      kd: [
        { every: 20, offset: 0 },
        { every: 40, offset: 22 }
      ],
      sd: [
        { every: 20, offset: 12 },
        { every: 40, offset: 4 }
      ],
      ch: [
        { every: 2, offset: 0 },
        { every: 20, offset: 1 }
      ],
    }
  }  
}



function BaseScore() {
  let offset = OFFSET;
  return {
    '2/4': {
      octave: 1,
      start: 0 + offset,
      drummer: -1, // already playing by default
      max: 105,
      last: 0,
      notes: [
        { len: '8n', step: 4, oct: 0 },
        { len: '8n', step: 2, oct: 0 },
        { len: '4n', step: 0, oct: 1 },
        //
        { len: '8n', step: 5, oct: 0 },
        { len: '8n', step: 0, oct: 0 },
        { len: '4n', step: 6, oct: 0 },
      ],
    },
    '3/4': {
      octave: 4,
      start: 18 + offset,
      drummer: (111 * 4) + offset,
      max: 67,
      last: 0,
      notes: [
        { len: '4n', step: 0, oct: 1 },
        { len: '8n', step: 4, oct: 0 },
        { len: '4n', step: 4, oct: 1 },
        { len: '8n', step: 2, oct: 1 },
        //
        { len: '8n', step: 0, oct: 1 },
        { len: '8n', step: 0, oct: 1 },
        { len: '8n', step: 4, oct: 0 },
        { len: '8n', step: 0, oct: 0 },
        { len: '4n', step: 2, oct: 1 }
      ],
    },
    '7/8': {
      octave: 3,
      start: 28 + offset,
      drummer: (171 * 4) + offset,
      max: 56,
      last: 2,
      notes: [
        { len: '8n',      step: 1, oct: 0 },
        { len: '8n',      step: 1, oct: 1 },
        { len: '8n',      step: 1, oct: 0 },
        { len: '2n',      step: 5, oct: 0 },
        //
        { len: '4n + 8n', step: 2, oct: 0 },
        { len: '2n',      step: 4, oct: 0 }
      ],
    },
    '4/4': {
      octave: 3,
      start: 40 + offset,
      drummer: (283 * 4) + offset,
      max: 47.5,
      last: 6,
      notes: [
        { len: '4n',      step: 2, oct: 0 },
        { len: '8n',      step: 4, oct: 0 },
        { len: '8n',      step: 6, oct: 0 },
        { len: '8n',      step: 1, oct: 0 },
        { len: '4n + 8n', step: 4, oct: 0 },
        //
        { len: '8n',      step: 6, oct: 0 },
        { len: '8n',      step: 2, oct: 1 },
        { len: '8n',      step: 6, oct: 0 },
        { len: '8n',      step: 4, oct: 0 },
        { len: '8n',      step: 2, oct: 0 },
        { len: '4n',      step: 6, oct: 0 },
        { len: '8n',      step: 0, oct: 1 }
      ],
    },
    '5/4': {
      octave: 5,
      start: 50 + offset,
      drummer: (363 * 4) + offset,
      max: 37,
      last: 4,
      notes: [
        { len: '4n', step: 0, oct: 1 },
        { len: '8n', step: 4, oct: 1 },
        { len: '8n', step: 0, oct: 1 },
        { len: '2n', step: 6, oct: 0 },
        { len: '4n', step: 4, oct: 0 },
        //
        { len: '2n', step: 5, oct: 0 },
        { len: '8n', step: 6, oct: 0 },
        { len: '8n', step: 4, oct: 1 },
        { len: '8n', step: 2, oct: 1 },
        { len: '8n', step: 6, oct: 0 },
        { len: '4n', step: 5, oct: 0 }
      ]
    }
  }
}


