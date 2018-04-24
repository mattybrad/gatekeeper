require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Tone from 'tone';
import Channel from './Channel';
import Slider from './Slider';

var sourceFile = require('../audio/source.mp3');

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      audioSourceReady: false
    }
  }

  handleAddChannelClick() {
    this.setState(prevState => ({
      channels: [...prevState.channels, 'x']
    }));
  }

  componentDidMount() {
    this.audioSource = new Tone.Player(sourceFile);

    Tone.Buffer.on('load', function() {

      // once buffer (sound) is loaded, loop it
      this.audioSource.loop = true;
      this.audioSource.start();

      this.noiseSource = new Tone.Noise('pink').start();
      this.sineSource = new Tone.Oscillator(60, 'sine').start();
      this.squareSource = new Tone.Oscillator(120, 'square').start();

      this.sourceMixer = new Tone.Volume();
      this.audioSource.connect(this.sourceMixer);
      this.noiseSource.connect(this.sourceMixer);
      this.sineSource.connect(this.sourceMixer);
      this.squareSource.connect(this.sourceMixer);

      Tone.Transport.loop = true;
      Tone.Transport.loopStart = '0:0';
      Tone.Transport.loopEnd = '1:0';
      Tone.Transport.start();

      this.setState({
        audioSourceReady: true
      })

    }.bind(this))
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
    }
  }

  render() {

    if(this.state.audioSourceReady) {
      return (
        <div className="index">
          <Slider onChange={this.updateParam.bind(this)} label='volume' min={-24} max={2} />
          <Slider onChange={this.updateParam.bind(this)} label='tempo' min={50} max={250} />
          <Slider onChange={this.updateParam.bind(this)} label='mp3' min={-24} max={0} />
          <Slider onChange={this.updateParam.bind(this)} label='sine' min={-24} max={0} />
          <Slider onChange={this.updateParam.bind(this)} label='square' min={-24} max={-12} />
          <Slider onChange={this.updateParam.bind(this)} label='noise' min={-24} max={-6} />
          <div id="addChannel" onClick={this.handleAddChannelClick.bind(this)}>Add Channel</div>
          {this.state.channels.map(function(val,i){
            return <Channel key={i} test={val} audioSource={this.sourceMixer} />;
          }.bind(this))}
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
