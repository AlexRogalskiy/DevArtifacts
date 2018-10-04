console.clear();

document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});

// our random seed. this allows all randomness to be reproducable.
const generator = new Math.seedrandom('in c is the best');
const container = document.querySelector('.container');
// how much visual history to store
const hist_depth = 250;
// resolution of piece
const res = 16;
// generating a note/rest object
let N = (length, value, octave) => {
  octave = (value) ? octave || 0 : null;
  value = value || null;
  // the step value is used in the canvas drawing
  // if a rest, pass a string for later detection
  let step = (value) ? 'C C# D D# E F F# G G# A A# B'.split(' ').indexOf(value) : 'REST';
  let sustain;
  // accounting for ties and dotted notes
  if(typeof length === 'object') { 
    // turn comma-delimited string into an array
    let lengths = Array.from(length);
    // creating sustain from array. 2,4 = 12 | 4,8 = 6 | 8,16 = 3
    sustain = 0;
    lengths.forEach((l) => { sustain += res / l; })
    // length uses tone.js `+` notation. 1,1 = '1n+1'. last `n` added in object below.
    length = lengths.join('n+');
  } else {
    // how many resolution values this sustains
    sustain = res / length;
  }
  
  let d = { value: value, step: step, length: `${length}n`, sustain: sustain, octave: octave };
  d.length = d.length.replace(/1n/g, '1m')
  return d;
  
};



class InC {
  constructor(params) {
    // resolution of schedule repeat (16 for 16th note)
    this.res = params.res;
    // all musical patterns
    this.patterns = this._patterns();
    // global stepper
    this.step = 0;
    // how many instruments have hit the end
    // in finale, decrements to know when all have stopped playing
    this.finished = 0;
    // is In C in the finale?
    this.finale = false;
    // is this playing?
    this.playing = false;
    // tick stepper
    this.tick = 0;

    this._instruments();
    this._canvas();
    this._randomness();
    this._transport();
    this._player();
  };
  
  _player() {
    // start it off
    this.play = () => {
      this.gain = 0.95;
      this.playing = true;
      Tone.Transport.start();
      this._tick();
    };
    
    this.pause = () => {
      this.gain = 0;
      this.playing = false;
      Tone.Transport.pause();
    };
    
    let updateBpm = (e) => {
      Tone.Transport.bpm.value = e.target.value;  
      this.bpm.innerHTML = 'bpm ' + e.target.value;
    };
    
    let bpm = document.createElement('input');
    bpm.setAttribute('type', 'range');
    bpm.setAttribute('min', '80');
    bpm.setAttribute('max', '280');
    bpm.setAttribute('step', '1');
    bpm.setAttribute('value', Tone.Transport.bpm.value);
    bpm.addEventListener('change', (e) => { updateBpm(e); })
    container.appendChild(bpm);
    
    this.bpm = document.createElement('div');
    this.bpm.innerHTML = 'bpm ' + Tone.Transport.bpm.value;
    container.appendChild(this.bpm);
    
    let togglePlay = () => {
      this.playing = !this.playing;
      if(this.playing) {
        // Tone.startMobile();
        this.play();
        container.classList.add('active'); 
      } else {
        this.pause();
        container.classList.remove('active'); 
      }
    };
    
    this.toggle = document.createElement('button');
    this.toggle.innerHTML = `<span>Play</span><span>Pause</span>`;
    container.appendChild(this.toggle);
    this.toggle.addEventListener('click', (e) => { togglePlay(); });
  };
  
  _tick() {
    this.tick++;
    
    this.ctx.clearRect(0, 0, this.cvs_w, this.cvs_h);

    this._drawLine(this.inst_lead);
    
    this.instruments.forEach((inst, i) => {
      this._drawLine(inst);
    });
    
    if(this.playing) {
      window.requestAnimationFrame(() => {
        this._tick();
      });
    }
  };
  
  _drawLine(inst) {
    // TODO: the offset on the left is wrong.
    let rest = false;
    if(inst.line.rel_pos === 'REST') rest = true;
    // the max step ratio, cutting off the lowest 8 notes as they arent played
    let rat = (inst.line.rel_pos - 8) / this.max_steps;
    // get the relative x based on octave and note
    let x = (rat * (this.cvs_w - this.pad * 2) + this.pad);
    // shift the history array
    inst.line.hist.shift();
    // add the new object to the history array
    inst.line.hist.push({rest: rest, x: x, y: this.cvs_h, draw: inst.line.draw, pos: inst.line.pos, rel_pos: inst.line.rel_pos});
    // for each item i nthe history
    inst.line.hist.forEach((h, i) => {
      if(!h.rest) {
        // the max step ratio
        let rat = h.rel_pos / this.max_steps;
        // set the width based on the note frequency
        let w = (1 - rat) * (this.node_w * 0.75) + this.node_w / 4;
        // if not a rest and not empty (in the beginning everything is undefined)
        if(h && h.draw) {
          // set the color based on the note
          let color = `hsla(${h.pos / 12 * 360}, 100%, 50%, 0.5)`;
          // set the y based on its historical position
          let local_y = h.y - h.y * (i / (hist_depth - 1));
          // set the color
          this.ctx.fillStyle = color;
          // draw teh rectangle
          this.ctx.fillRect(h.x - w/2, local_y, w, this.node_h);
        } 
      }
    });
  };
  
  _canvas() {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.pad = 40;
    this.cvs_w = window.innerWidth * 2;
    this.cvs_h = window.innerHeight * 2;
    this.node_w = (this.cvs_w - this.pad * 2) / 7 / 12 - 8;
    this.node_h = (this.cvs_h) / hist_depth - 4;
    this.cvs.width = this.cvs_w;
    this.cvs.height = this.cvs_h;
    
    document.body.appendChild(this.cvs);
  };
  
  _randomness() {
    let min_repeat_time = 240; // 240 16th notes @ 120bpm = min 30 seconds per measure
    let max_repeat_time = 480; // 480 16th notes @ 120bpm = max 1 minute per measure
    let max_start = 240; // maximum amount of 16th notes before starting
    min_repeat_time = 30; // quicker performance, doubling this makes tone crash right at the end
    max_repeat_time = 60; // quicker performance, doubling this makes tone crash right at the end
    max_start =  240; // quicker performance
    let dif_repeat_time = max_repeat_time - min_repeat_time;
    let pattern_lengths = [];
    // get the res lengths of each pattern
    this.patterns.forEach((pattern) => {
      let length = 0;
      pattern.forEach((note) => { length += note.sustain; });
      pattern_lengths.push(length);
    });
    // for each instrument, set the randomization for each pattern
    this.instruments.forEach((inst) => {
      // steppers
      inst.start_i = 0;
      inst.repeat_i = 0;
      // array of how many times to repeat each pattern
      // [2,4] would loop the first pattern twice and second pattern four times
      inst.repeats = [];
      // generate a random start step
      inst.start = Math.floor(max_start * generator.quick());
      // for each pattern
      pattern_lengths.forEach((length) => {
        // maximum amount of repeats to add to minimum repeat count
        let dif_repeats = Math.floor(dif_repeat_time / length);
        // the minimum amount of repeats for the pattern
        let min_repeats = Math.floor(min_repeat_time / length);
        // push a random repeat value
        inst.repeats.push(Math.floor(generator.quick() * dif_repeats + min_repeats));
      });
      // this is the finale repeat count of the last measure, same as in the above loop
      // we need the extra because the composition asks that everyone waits until they are all
      //   on the last pattern before stopping one at a time
      let length = pattern_lengths[pattern_lengths.length - 1];
      let dif_repeats = Math.floor(dif_repeat_time / length);
      // the final fade out
      inst.finale = Math.floor(generator.quick() * dif_repeats);
    });
  };
  
  _instruments() {
    // max amount of steps. 7 octaves = 12 * 7 = 84
    this.max_steps = 84;
    // master gain
    this.gain = new Tone.Gain(0.95).toMaster();
    // master reverb
    let verb = new Tone.Freeverb();
    verb.wet.value = 0.2;
    verb.dampening.value = 2000;
    verb.chain(this.gain);
    
    // this holds all the instruments
    this.instruments = [];
    let gens = [
      /*['synth_1', 3], */['synth_1', 4], ['synth_1', 5],
      ['synth_2', 1], ['synth_2', 2], ['synth_2', 3],
      ['synth_3', 4], ['synth_3', 5], ['synth_3', 6],
      ['synth_4', 1], ['synth_4', 2], ['synth_4', 3],
      /*['synth_5', 4]*/, ['synth_5', 5], ['synth_5', 6],
    ];
    // generate the lead instrument (the constant C6)
    this.inst_lead = new Instrument({ type: 'lead', octave: 6 });
    // set the current relative position on the instrument line
    this.inst_lead.line.rel_pos = 12 * 6;
    this.inst_lead.line.pos = 0;
    this.inst_lead.line.draw = true;
    // relative gain to instrument count includes instruments gain modifier
    let gain = new Tone.Gain(this.inst_lead.gain * (1 / (gens.length + 1)));
    this.inst_lead.synth.chain(gain, verb);
    gens.forEach((gen, i) => {
      let inst = new Instrument({ type: gen[0], octave: gen[1] });
      let pan = new Tone.Panner(i / (gens.length  - 1));
      // relative gain to instrument count includes instruments gain modifier
      let gain = new Tone.Gain(inst.gain * (1 / (gens.length + 1)));
      inst.synth.chain(gain, pan, verb);
      this.instruments.push(inst);
    });
  };
  
  _transport() {
    Tone.Transport.bpm.value = 140;
    Tone.Transport.scheduleRepeat((time) => { this._update(time); }, this.res);
  };
  
  _update(time) {
    // every 4 16th notes (1 quarter note)
    if(this.step % 4 === 0) {
      // play the main babe
      this.inst_lead.synth.triggerAttackRelease('C' + this.inst_lead.octave, '8n', time);
    }
    
    // play each instrument
    this.instruments.forEach((inst, i) => {
      // determine whether or not to start the instrument
      if(!inst.playing && !this.finale) {
        // if it is time to start
        if(inst.start_i >= inst.start) { 
          // call the patternChange for the instrument
          inst.patternChange();
          // prevent this from being called again
          inst.playing = true; 
        }
        // increment the start counter
        inst.start_i++;
      }
      
      // if the instrument is playing
      if(inst.playing) {
        // if the pattern exists
        if(inst.pattern < this.patterns.length) {
          // if it is the first, update the pattern change
          if(inst.pattern === 0 && !inst.curr_pattern) {
            inst.patternChange();
            // set the curr pattern for this instrument
            inst.curr_pattern = this.patterns[inst.pattern];
          }
          // grab the pattern
          // grab the note from the pattern
          let note = inst.curr_pattern[inst.step];

          // if we aren't sustaining a previous note
          if(inst.sustain < inst.sustain_to) {
            // increase sustain
            inst.sustain++;
          // if we arent sustaining, we need a new note
          } else {
            // reset sustain
            inst.sustain = 0;
            // set the sustain value to the notes sustain time
            inst.sustain_to = note.sustain;
            // if the note is not a rest
            if(note.value) {
              // set the current relative position on the instrument line
              inst.line.rel_pos = note.step + 12 * (note.octave + inst.octave || 1);
              inst.line.pos = note.step;
              inst.line.draw = true;
              // grab the value and octave
              let value = note.value + (note.octave + inst.octave || 1);
              // play the note
              try {
                inst.synth.triggerAttackRelease(value, note.length, time);
              } catch (e) {
                console.log('BAD', note.length)
              }
            // if the note is a rest
            } else {
              // set the current y on the instrument
              inst.line.rel_pos = 'REST';
              inst.line.pos = 'REST';
              inst.line.draw = false;
            }
            // increase the instruments stepper
            inst.step++;
          }
        }
        
        // if the instrument step is the last note of the pattern
        if(inst.step === inst.curr_pattern.length) {
          // increase the repeat stepper
          if(!inst.finished || inst.finished && this.finale) inst.repeat_i++;
          // if the instrument is not waiting for others to finish
          //   and is done all of its repeats
          if(!inst.finished && inst.repeat_i >= inst.repeats[inst.pattern]) {
            // reset the repeat stepper
            inst.repeat_i = 0;
            // if the pattern is not the last
            if(inst.pattern < this.patterns.length - 1) {
              // increase the pattern stepper
              inst.pattern++;
              inst.curr_pattern = this.patterns[inst.pattern];
              // do the pattern change
              inst.patternChange();
            // the pattern is the last
            } else {
              // set instrument to be finished
              inst.finished = true;
              // reset its repeat stepper
              inst.repeat_i = 0;
              // increase the global "finished" count
              this.finished++;
              // if this is the last instrument to finish
              if(this.finished === this.instruments.length) {
                console.log('finale!');
                // set the global finale mode
                this.finale = true;
              }
            }
          // if it has done all of its repeats and it is waiting for others to finish
          } else if(inst.finished) {
            // if all others have finished and we are in the finale
            if(this.finale) {
              // if it has repeated its finale ammount
              if(inst.repeat_i >= inst.finale) {
                // silence it
                inst.playing = false;
                // decrease the finished count
                this.finished--;
                inst.line.rel_pos = 'REST';
                inst.line.pos = 'REST';
                // if it is the last one to finish the finale
                if(this.finished === 0) {
                  this.inst_lead.line.rel_pos = 'REST';
                  this.inst_lead.line.pos = 'REST';
                  // stop the playback in three whole notes
                  // this delay will allow the lead C6 to play by itself for a bit
                  Tone.Transport.stop();
                }
              }
            }
          }
          // reset the stepper
          inst.step = 0;
        }
          
      }
    });
    
    // increase the global step
    this.step++;
  };
  
  // all 53 patterns of "In C" c. Terry Riley 1964
  // http://www.flagmusic.com/content/clips/inc.pdf
  _patterns() {
    return [
      [ // 1
        N(4,'E'), N(4,'E'), N(4,'E')
      ],
      [ // 2
        N(8,'E'), N(8,'F'), N(4,'E')
      ],
      [ // 3
        N(8), N(8,'E'), N(8,'F'), N(8,'E')
      ],
      [ // 4
        N(8), N(8,'E'), N(8,'F'), N(8,'G')
      ],
      [ // 5
        N(8,'E'), N(8,'F'), N(8,'G'), N(8)
      ],
      [ // 6
        N([1,1],'C',1)
      ],
      [ // 7
        N([4,4,4,8]), N(16,'C'), N(16,'C'), N(8,'C'), N([8,4,4,4,4])
      ],
      [ // 8
        N([1,2],'G'), N([1,1],'F')
      ],
      [ // 9
        N(16,'B'), N(16,'G'), N([8,4,4,4])
      ],
      [ // 10
        N(16,'B'), N(16,'G')
      ],
      [ // 11
        N(16,'F'), N(16,'G'), N(16,'B'), N(16,'G'), N(16,'B'), N(16,'G')
      ],
      [ // 12
        N(16,'F'), N(16,'G'), N(1,'B'), N(4,'C',1)
      ],
      [ // 13
        N(16,'B'), N([8,16],'G'), N(16,'G'), N(16,'F'), N(8,'G'), N([8,16]), N([16,2,4],'G')
      ],
      [ // 14
        N(1,'C',1), N(1,'B'), N(1,'G'), N(1,'F#')
      ],
      [ // 15
        N(16,'G'), N([8,16,4,4,4])
      ],
      [ // 16
        N(16,'G'), N(16,'B'), N(16,'C',1), N(16,'B')
      ],
      [ // 17
        N(16,'B'), N(16,'C'), N(16,'B'), N(16,'C'), N(16,'B'), N(16)
      ],
      [ // 18
        N(16,'E'), N(16,'F#'), N(16,'E'), N(16,'F#'), N([8,16],'E'), N(16,'E')
      ],
      [ // 19
        N([4,8]), N([4,8],'G',1)
      ],
      [ // 20
        N(16,'E'), N(16,'F#'), N(16,'E'), N(16,'F#'), N([8,16],'B',-1), 
        N(16,'E'), N(16,'F#'), N(16,'E'), N(16,'F#'), N(16,'E')
      ],
      [ // 21
        N([2,4],'F#')
      ],
      [ // 22
        N([4,8],'E'), N([4,8],'E'), N([4,8],'E'), N([4,8],'E'), N([4,8],'E'), 
        N([4,8],'F#'), N([4,8],'G'), N([4,8],'A'), N(8,'B')
      ],
      [ // 23
        N(8,'E'), N([4,8],'F#'), N([4,8],'F#'), N([4,8],'F#'), N([4,8],'F#'), N([4,8],'F#'), 
        N([4,8],'G'), N([4,8],'A'), N(4,'B'), 
      ],
      [ // 24
        N(8,'E'), N(8,'F#'), N([4,8],'G'), N([4,8],'G'), N([4,8],'G'), N([4,8],'G'), N([4,8],'G'),
        N([4,8],'A'), N(8,'B')
      ],
      [ // 25
        N(8,'E'), N(8,'F#'), N(8,'G'), N([4,8],'A'), N([4,8],'A'), N([4,8],'A'), N([4,8],'A'), 
        N([4,8],'A'), N([4,8],'B')
      ],
      [ // 26
        N(8,'E'), N(8,'F#'), N(8,'G'), N(8,'A'), N([4,8],'B'), N([4,8],'B'), N([4,8],'B'),
        N([4,8],'B'), N([4,8],'B')
      ],
      [ // 27
        N(16,'E'), N(16,'F#'), N(16,'E'), N(16,'F#'), N(8,'G'), N(16,'E'), N(16,'G'),
        N(16,'F#'), N(16,'E'), N(16,'F#'), N(16,'E')
      ],
      [ // 28
        N(16,'E'), N(16,'F#'), N(16,'E'), N(16,'F#'), N([8,16],'E'), N(16,'E')
      ],
      [ // 29
        N([2,4],'E'), N([2,4],'G'), N([2,4],'C',1)
      ],
      [ // 30
        N([1,2],'C',1)
      ],
      [ // 31
        N(16,'G'), N(16,'F'), N(16,'G'), N(16,'B'), N(16,'G'), N(16,'B')
      ],
      [ // 32
        N(16,'F'), N(16,'G'), N(16,'F'), N(16,'G'), N(16,'B'), N([16,2,4],'F'), N([4,8],'G')
      ],
      [ // 33
        N(16,'G'), N(16,'F'), N(8)
      ],
      [ // 34
        N(16,'G'), N(16,'F')
      ],
      [ // 35
        N(16,'F'), N(16,'G'), N(16,'B'), N(16,'G'), N(16,'B'), N(16,'G'), N(16,'B'), N(16,'G'), N(16,'B'), N(16,'G'), 
        N([8,4,4,4]), N(4,'A#'), N([2,4],'G',1), N(8,'A',1), N([8,8],'G',1), N(8,'B',1), N([4,8],'A',1), N(8,'G',1), N([2,4],'E',1),
        N(8,'G',1), N([8,2,4],'F#',1), N([4,4,8]), N([8,2],'E',1), N([2,4],'F',1)
      ],
      [ // 36
        N(16,'F'), N(16,'G'), N(16,'B'), N(16,'G'), N(16,'B'), N(16,'G')
      ],
      [ // 37
        N(16,'F'), N(16,'G')
      ],
      [ // 38
        N(16,'F'), N(16,'G'), N(16,'B')
      ],
      [ // 39
        N(16,'B'), N(16,'G'), N(16,'F'), N(16,'G'), N(16,'B'), N(16,'C',1)
      ],
      [ // 40
        N(16,'B'), N(16,'F')
      ],
      [ // 41
        N(16,'B'), N(16,'G')
      ],
      [ // 42
        N(2,'C',1), N(2,'B'), N(2,'A'), N(2,'C',1)
      ],
      [ // 43
        N(16,'F',1), N(16,'E',1), N(16,'F',1), N(16,'E',1), N(8,'E',1), N(8,'E',1), N(8,'E',1), N(16,'F',1), N(16,'E',1)
      ],
      [ // 44
        N(8,'F',1), N([8,8],'E',1), N(8,'E',1), N(4,'C',1)
      ],
      [ // 45
        N(4,'D',1), N(4,'D',1), N(4,'G')
      ],
      [ // 46
        N(16,'G'), N(16,'D',1), N(16,'E',1), N(16,'D',1), N(8), N(8,'G'), N(8), N(8,'G'), N(8), N(8,'G'),
        N(16,'G'), N(16,'D',1), N(16,'E',1), N(16,'D',1)
      ],
      [ // 47
        N(16,'D',1), N(16,'E',1), N(8,'D',1)
      ],
      [ // 48
        N([1,2],'G'), N(1,'G'), N([1,4],'F')
      ],
      [ // 49
        N(16,'F'), N(16,'G'), N(16,'A#'), N(16,'G'), N(16,'A#'), N(16,'G')
      ],
      [ // 50
        N(16,'F'), N(16,'G')
      ],
      [ // 51
        N(16,'F'), N(16,'G'), N(16,'A#')
      ],
      [ // 52
        N(16,'G'), N(16,'A#')
      ],
      [ // 53
        N(16,'A#'), N(16,'G')
      ]
    ]
  }
};

class Instrument {
  constructor(params) {
    this.type = params.type;
    this.octave = params.octave;
    this.line = new Line();
    this.instruments = this._instruments();
    
    this._setInstrument();
    if(this.type !== 'lead') this._setElement();
    this.patternChange = this._patternChange;
  };
  
  _patternChange() {
    this.current_pattern.innerHTML = this.pattern + 1;
    this.progress.style.width = (this.pattern + 1) / 53 * 100 + '%';
  };
  
  _setElement() {
    this.el = document.createElement('div');
    this.current_pattern = document.createElement('span');
    
    let progress_wrap = document.createElement('div');
    progress_wrap.classList.add('progress');
    this.progress = document.createElement('span');
    progress_wrap.appendChild(this.progress);
    
    this.el.appendChild(progress_wrap);
    this.el.appendChild(this.current_pattern);
    
    container.appendChild(this.el);
    
    if(this.type === 'lead') {
    } else {
      this.current_pattern.innerHTML = '';
    }
  };
  
  _setInstrument() {
    let inst = this.instruments[this.type];
    
    this.synth = new Tone[inst.instrument]();
    this.gain = inst.gain;
    
    if(inst.instrument === 'FMSynth') {
      this.synth.harmonicity.value = 1;
      this.synth.modulationIndex.value = 3;
      this.synth.oscillator.type = inst.wave;
      this.synth.envelope.attack = inst.attack;
      this.synth.modulation.type = inst.wave;
      this.synth.modulationEnvelope.attack = inst.attack;
    } else if (inst.instrument === 'AMSynth') {
      this.synth.harmonicity.value = 1;
      this.synth.oscillator.type = inst.wave;
      this.synth.envelope.attack = inst.attack;
      this.synth.modulation.type = inst.wave;
      this.synth.modulationEnvelope.attack = inst.attack;
    }
    
    this.playing = false;
    this.pattern = 0;
    this.sustain_to = 0;
    this.sustain = 0;
    this.step = 0;    
  };
  
  _instruments() {
    return {
      lead:    { instrument: 'FMSynth', gain: 1.0, wave: 'triangle', attack: 0.200 },
      synth_1: { instrument: 'FMSynth', gain: 0.8, wave: 'sine',     attack: 0.150 },
      synth_2: { instrument: 'FMSynth', gain: 0.8, wave: 'triangle', attack: 0.010 },
      synth_3: { instrument: 'AMSynth', gain: 0.8, wave: 'triangle', attack: 0.005 },
      synth_4: { instrument: 'AMSynth', gain: 0.8, wave: 'sine',     attack: 0.150 },
      synth_5: { instrument: 'AMSynth', gain: 0.5, wave: 'square',   attack: 0.150 },
    }
  };
};

class Line {
  constructor() {
    // how much history to store on a line
    this.hist_depth = hist_depth;
    this.hist = [];
    this.hist.length = this.hist_depth;
    this.rel_pos = 'REST';
    this.pos = 'REST';
    this.draw = false;
  };
};


var app = new InC({ res: res + 'n' });

