require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Tone from 'tone';
import Channel from './Channel';
import Knob from './Knob';
import CassetteDeck from './CassetteDeck';

var sourceFile1 = require('../audio/source1.mp3');
var sourceFile2 = require('../audio/source2.mp3');
var sourceFile3 = require('../audio/source3.mp3');

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioSourceReady: false
    }
    this.audioSources = {
      source1: sourceFile1,
      source2: sourceFile2,
      source3: sourceFile3
    }
  }

  componentDidMount() {
    this.audioSourceGroup = new Tone.Players(this.audioSources, function() {

      // once buffer (sound) is loaded, loop it
      this.audioSource = this.audioSourceGroup.get('source1');
      this.audioSource.loop = true;
      this.audioSource.start();

      this.noiseSource = new Tone.Noise('pink').start();
      this.sineSource = new Tone.Oscillator(60, 'sine').start();
      this.squareSource = new Tone.Oscillator(120, 'square').start();

      this.sourceMixer = new Tone.Volume();
      this.audioSource.connect(this.sourceMixer);
      //this.noiseSource.connect(this.sourceMixer);
      //this.sineSource.connect(this.sourceMixer);
      //this.squareSource.connect(this.sourceMixer);

      Tone.Transport.loop = true;
      Tone.Transport.loopStart = '0:0';
      Tone.Transport.loopEnd = '1:0';
      Tone.Transport.start();

      this.setState({
        audioSourceReady: true
      })

    }.bind(this))
  }

  switchSource(newSource) {
    if(this.audioSource) this.audioSource.stop();
    this.audioSource = this.audioSourceGroup.get(newSource);
    this.audioSource.loop = true;
    this.audioSource.start();
    this.audioSource.connect(this.sourceMixer);
  }

  updateParam(param, value) {
    switch(param) {
      case 'volume':
      Tone.Master.volume.value = value;
      Tone.Master.mute = (value <= -24);
      break;

      case 'tempo':
      Tone.Transport.bpm.rampTo(value, 0.5);
      break;

      case 'mp3':
      this.audioSource.volume.value = value;
      this.audioSource.mute = (value <= -24);
      break;

      case 'noise':
      this.noiseSource.volume.value = value;
      this.noiseSource.mute = (value <= -24);
      break;

      case 'sine':
      this.sineSource.volume.value = value;
      this.sineSource.mute = (value <= -24);
      break;

      case 'square':
      this.squareSource.volume.value = value;
      this.squareSource.mute = (value <= -24);
      break;

      case 'mp3 source':
      this.switchSource(value);
      break;

      case 'speed':
      this.audioSource.playbackRate = value;
      break;
    }
  }

  chooseSource() {
    alert("CHOOSE");
  }

  render() {

    if(this.state.audioSourceReady) {
      return (
        <div className="index">
          <div className='topLeft'>
            <CassetteDeck
              onEject={this.chooseSource.bind(this)}
            />
          </div>
          <div className='bottomLeft'>
            <Knob onChange={this.updateParam.bind(this)} label='volume' min={-24} max={2} start={0} />
            <Knob onChange={this.updateParam.bind(this)} label='tempo' min={50} max={250} start={120} />
            <Knob onChange={this.updateParam.bind(this)} label='speed' min={0.1} max={4} start={1} />
          </div>
          <div className='right'>
            <Channel
              audioSource={this.sourceMixer}
              frequency={150}
              filter={'lowpass'}
            />
            <Channel
              audioSource={this.sourceMixer}
              frequency={600}
              Q={20}
              filter={'bandpass'}
            />
            <Channel
              audioSource={this.sourceMixer}
              frequency={2000}
              filter={'highpass'}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="index"></div>
      );
    }
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
