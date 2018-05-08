require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Tone from 'tone';
import Channel from './Channel';
import Slider from './Slider';
import Selector from './Selector';
import CassetteDeck from './CassetteDeck';

var sourceFile1 = require('../audio/source1.mp3');
var sourceFile2 = require('../audio/source2.mp3');
var sourceFile3 = require('../audio/source3.mp3');

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      audioSourceReady: false
    }
    this.audioSources = {
      source1: sourceFile1,
      source2: sourceFile2,
      source3: sourceFile3
    }
  }

  handleAddChannelClick() {
    this.setState(prevState => ({
      channels: [...prevState.channels, 'x']
    }));
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
    }
  }

  render() {

    if(this.state.audioSourceReady) {
      return (
        <div className="index">
          <div className='topLeft'>
            <CassetteDeck />
          </div>
          <div className='bottomLeft'>
            <Slider onChange={this.updateParam.bind(this)} label='volume' min={-24} max={2} />
            <Slider onChange={this.updateParam.bind(this)} label='tempo' min={50} max={250} />
            <Selector onChange={this.updateParam.bind(this)} label='mp3 source' options={['source1','source2','source3']} />
            <Slider onChange={this.updateParam.bind(this)} label='mp3' min={-24} max={0} />
            <Slider onChange={this.updateParam.bind(this)} label='sine' min={-24} max={0} />
            <Slider onChange={this.updateParam.bind(this)} label='square' min={-24} max={-12} />
            <Slider onChange={this.updateParam.bind(this)} label='noise' min={-24} max={-6} />
            <div id="addChannel" onClick={this.handleAddChannelClick.bind(this)}>Add Channel</div>
            {this.state.channels.map(function(val,i){
              return <Channel key={i} test={val} audioSource={this.sourceMixer} />;
            }.bind(this))}
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
