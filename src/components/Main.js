require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Tone from 'tone';
import Channel from './Channel';
import Slider from './Slider';

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
    this.audioSource = new Tone.Player('../audio/source.mp3');

    Tone.Buffer.on('load', function() {

      // once buffer (sound) is loaded, loop it
      this.audioSource.loop = true;
      this.audioSource.start();

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
      break;

      case 'tempo':
      Tone.Transport.bpm.rampTo(value, 0.5);
      break;
    }
  }

  render() {

    if(this.state.audioSourceReady) {
      return (
        <div className="index">
          <Slider onChange={this.updateParam.bind(this)} label='volume' min={-100} max={0} />
          <Slider onChange={this.updateParam.bind(this)} label='tempo' min={50} max={250} />
          <div id="addChannel" onClick={this.handleAddChannelClick.bind(this)}>Add Channel</div>
          {this.state.channels.map(function(val,i){
            return <Channel key={i} test={val} audioSource={this.audioSource} />;
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
