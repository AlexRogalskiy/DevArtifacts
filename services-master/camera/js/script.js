// console.clear();

class ColorMapper {
  constructor(di, vid, cvs) {
    this.di = di;
    this.cvs = cvs;
    this.ctx = cvs.getContext('2d');
    this.vid = vid;
    this.rgb = new Array(di * di);
    this.report = document.querySelector('header');
    this.avgRGB = null;
    this.avgHSL = null;
    this._initialize();
  }

  start(stream) {
    try {
      this.vid.srcObject = stream;
    } catch (error) {
      console.log(error)
      this.vid.src = URL.createObjectURL(stream);
    }
    this.vid.play();
    let self = this;
    this.vid.onloadedmetadata = function() { 
      self.w = self.vid.videoWidth / self.vid.videoHeight * self.cvs.width;
      self.vid.width = self.vid.videoWidth;
      self.vid.height = self.vid.videoHeight;
      self.offX = (self.w - self.cvs.width) * -0.5;
      self._animate();
    }
  }

  _animate() {
    window.requestAnimationFrame(this._animate.bind(this));
    this.ctx.drawImage(this.vid, this.offX, 0, this.w, this.di);
    this._processData();
  }
  
  _initialize() {
    this.cvs.height = this.di;
    this.cvs.width  = this.di;
  }
  
  _processData() {
    let imgData = this.ctx.getImageData(0, 0, this.di, this.di),
        data = imgData.data,
        len = data.length,
        avg = [0, 0, 0];
    for (let i = 0; i < len; i += 4) {
      let colorIdx = i * 0.25,
        newRgb = [data[i], data[i + 1], data[i + 2]],
        prevRgb = this.rgb[colorIdx],
        easeRgb = this._easeVals(prevRgb, newRgb);
      imgData.data[i + 0] = easeRgb[0];
      imgData.data[i + 1] = easeRgb[1];
      imgData.data[i + 2] = easeRgb[2];
      avg[0] += easeRgb[0];
      avg[1] += easeRgb[1];
      avg[2] += easeRgb[2];
      this.rgb[colorIdx] = easeRgb;
    }
    let colors = len * 0.25;
    avg[0] /= colors;
    avg[1] /= colors;
    avg[2] /= colors;
    this.avgRGB = avg;
    this.avgHSL = this._rgbToHsl(avg);
    document.body.style.backgroundColor = `rgb(${avg.map(Math.round).join(',')})`;
    this.ctx.putImageData(imgData, 0, 0);
    this.report.innerHTML = `
      ${this._gradientSpan('h', this.avgHSL[0])}
    `
  }
  
  _gradientSpan(type, value) {
    let gradient = [];
    
    if (type === 'h')
      for (let i = 0; i < 7; i++)
        gradient.push(`hsl(${i / 7 * 360}, 100%, 60%)`);
    else if (type === 's')
      for (let i = 0; i < 7; i++)
        gradient.push(`hsl(0, ${i / 7 * 100}%, 60%)`);
    else if (type === 'l')
      for (let i = 0; i < 7; i++)
        gradient.push(`hsl(0, 0%, ${i / 7 * 100}%)`);
    return `
      <div>
        ${gradient.map(g => `<span style="background-color: ${g}"></span>` ).join('')}
        <span style="left: ${value * 100}%"></span>
      </div>
    `;
  }
  
  _easeVals(prev, next, ease = 0.025) {
    if (!prev) return next;
    return next.map((n, i) => (n - prev[i]) * ease + prev[i]);
  }

  // https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
  _rgbToHsl(rgb) {
    let [r, g, b] = rgb;
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) h = s = 0;
    else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, l];
  }
}

class Score {
  constructor(map) {
    this.map = map;
    this.noteIdx = 0;
    this.tick = 0;
    this._initialize();
  }
  
  toggle() {
    if (this.on) {
      this.on = false;
      Tone.Transport.stop();
      this.tick = 0;
      this.synth.triggerRelease();
      this.mid.triggerRelease();
      this.bass1.triggerRelease();
      this.bass2.triggerRelease();
      document.querySelector('button').classList.remove('active');
    } else {
      this.on = true;
      Tone.Transport.start();
      document.querySelector('button').classList.add('active');
    }
  }

  step(time) {
    let hsl = this.map.avgHSL,
      safe = i => Math.max(0, i - 0.000000001);
    if (!hsl || !this.on) return;
    if (this.tick % 4 === 0) {
      this.noteIdx = Math.floor(safe(hsl[0]) * 7);
      this.hsl = hsl;
    }
    let note = this.note,
      pattern = [2, 0, 1, 0, 2, 1, 2, 0],
      octaves = [5, 5, 4, 4, 4, 5, 4, 4],
      arpNote = note[pattern[this.tick % 8]],
      arpOct = octaves[this.tick % 8];
    arpOct += arpNote[1];
    let arp = `${arpNote[0]}${arpOct}`;
    let mtd = (this.tick === 0) ? 'triggerAttack' : 'setNote';
    this.synth[mtd](arp, time);
    if (this.tick % 4 === 0) {
      let bass1 = note[0],
        bass2 = note[2],
        mid = note[1];
      this.mid[mtd](mid[0]+(mid[1]+3), time);
      this.bass1[mtd](bass1[0]+(bass1[1]+1), time);
      this.bass2[mtd](bass2[0]+(bass2[1]+1), time);
    }
    this.tick++;
  }

  get note() {
    return this.notes[this.noteIdx];
  }
  
  get notes() {
    return [
      [['G',  0], ['A#', 0], ['C#', 1]],
      [['A#', 0], ['C#', 1], ['F',  1]],
      [['C#', 1], ['F',  1], ['G#', 1]],
      [['F',  1], ['G#', 1], ['C',  2]],
      [['D#', 1], ['G',  1], ['A#', 1]],
      [['C',  1], ['D#', 1], ['G',  1]],
      [['G#', 0], ['C',  1], ['D#', 1]],
    ];
    // return [
    //   [['G',  0], ['A#', 0], ['C#', 1]],
    //   [['G#', 0], ['C',  1], ['D#', 1]],
    //   [['A#', 0], ['C#', 1], ['F',  1]],
    //   [['C',  1], ['D#', 1], ['G',  1]],
    //   [['C#', 1], ['F',  1], ['G#', 1]],
    //   [['D#', 1], ['G',  1], ['A#', 1]],
    //   [['F',  1], ['G#', 1], ['C',  2]],
    // ];
  }
  
  _initialize() {
    this.synth = new Tone.Synth({
      portamento: 0.00625,
      oscillator: { type: 'sine' },
      envelope: { release: 0.07 }
    });
    this.mid = new Tone.Synth({
      portamento: 0.00625,
      oscillator: { type: 'triangle' },
      envelope: { release: 0.07 }
    });
    this.bass1 = new Tone.FMSynth({
      portamento: 0.0125
    });
    this.bass2 = new Tone.FMSynth({
      portamento: 0.0125
    });
    let gain1 = new Tone.Gain(0.4),
      gain2 = new Tone.Gain(0.5),
      pan1 = new Tone.Panner(-1),
      pan2 = new Tone.Panner(1);
    this.synth.connect(gain1);
    this.mid.connect(gain1);
    pan1.connect(gain2);
    pan2.connect(gain2);
    this.bass1.connect(pan1);
    this.bass2.connect(pan2);
    gain1.toMaster();
    gain2.toMaster();
    Tone.Transport.scheduleRepeat(time => {
      this.step(time);
    }, '16n');
    Tone.Transport.bpm.value = 120;
  }
}

const vid = document.querySelector('video'),
  cvs = document.querySelector('canvas'),
  map = new ColorMapper(4, vid, cvs),
  score = new Score(map);

navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  .then(stream => {
    map.start(stream);
    document.querySelector('button').addEventListener('click', () => score.toggle());
  })
  .catch(err => {
    if (window.location.href.match('debug')) {
      alert('Sorry. This wont work on your browser or device. Update or use Chrome/Firefox.')
    } else {
      document.querySelector('div.trydebug').classList.remove('hide');
    }
  });


StartAudioContext(Tone.context, '#button')