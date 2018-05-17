require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Tone from 'tone';
import Channel from './Channel';
import Knob from './Knob';
import CassetteDeck from './CassetteDeck';
import Modal from './Modal';
import EmbossedLabel from './EmbossedLabel';
import PatternSelector from './PatternSelector';

var testSource = require('../audio/source1.mp3');

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioSourceReady: false,
      sourceListVisible: false,
      currentSource: 'storm'
    }
    this.player = new Tone.Player();
  }

  componentDidMount() {
    this.player.load(testSource, function(){
      this.player.loop = true;
      this.player.start();
    }.bind(this));

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = '0:0';
    Tone.Transport.loopEnd = '1:0';
    Tone.Transport.start();

    this.setState({
      audioSourceReady: true
    })
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

      case 'mp3 source':
      // sort this out later
      break;

      case 'speed':
      this.player.playbackRate = value;
      break;
    }
  }

  showSources() {
    this.setState({
      sourceListVisible: true
    })
  }

  chooseSource(newSource, ev) {
    ev.stopPropagation();
    this.setState({
      currentSource: newSource,
      sourceListVisible: false
    })
  }

  hideSources() {
    this.setState({
      sourceListVisible: false
    })
  }

  render() {

    var dummySourceList = [
      'messy drums',
      'mellotron choir',
      'storm',
      'acoustic guitar',
      'classical guitar',
      'big ben',
      'mall',
      'museum',
      'distilled jazz',
      'distilled rock',
      'distilled indie',
      'distilled pop',
      'distilled classical'
    ];
    var sourceItems = [];
    for(var i = 0; i < dummySourceList.length; i ++) {
      sourceItems.push(<li key={'sourceItem_'+i} onClick={this.chooseSource.bind(this,dummySourceList[i])}>{dummySourceList[i]}</li>);
    }

    var modal = <Modal onDismiss={this.hideSources.bind(this)}><ul>{sourceItems}</ul></Modal>;

    return (
      <div className="index">
        {this.state.sourceListVisible?modal:null}
        <div className='topLeft'>
          <div>
            <EmbossedLabel rotation={-2}>Gatekeeper</EmbossedLabel><br/><br/>
            <EmbossedLabel rotation={3}>Folktronic Drum Machine</EmbossedLabel><br/>
            <br/><br/><br/>
            <CassetteDeck
              onEject={this.showSources.bind(this)}
              cassetteLabel={this.state.currentSource}
            />
          </div>
        </div>
        <div className='bottomLeft'>
          <Knob onChange={this.updateParam.bind(this)} label='volume' min={-24} max={2} start={0} />
          <Knob onChange={this.updateParam.bind(this)} label='mix' min={0} max={1} start={0.5} />
          <Knob onChange={this.updateParam.bind(this)} label='tempo' min={50} max={250} start={120} />
          <Knob onChange={this.updateParam.bind(this)} label='speed' min={0.1} max={4} start={1} />
        </div>
        <div className='right'>
          <Channel
            audioSource={this.player}
            frequency={150}
            filter={'lowpass'}
          />
          <Channel
            audioSource={this.player}
            frequency={600}
            Q={20}
            filter={'bandpass'}
          />
          <Channel
            audioSource={this.player}
            frequency={2000}
            filter={'highpass'}
          />
          <PatternSelector/>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
