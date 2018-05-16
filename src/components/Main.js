require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Tone from 'tone';
import Channel from './Channel';
import Knob from './Knob';
import CassetteDeck from './CassetteDeck';
import Modal from './Modal';
import EmbossedLabel from './EmbossedLabel';

var sourceFile1 = require('../audio/source1.mp3');
var sourceFile2 = require('../audio/source2.mp3');
var sourceFile3 = require('../audio/source3.mp3');

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioSourceReady: false,
      sourceListVisible: false,
      currentSource: 'storm'
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

    if(this.state.audioSourceReady) {
      return (
        <div className="index">
          {this.state.sourceListVisible?modal:null}
          <div className='topLeft'>
            <div>
              <EmbossedLabel rotation={-2}>Gatekeeper</EmbossedLabel><br/><br/>
              <EmbossedLabel rotation={3}>Folktronica Drum Machine</EmbossedLabel><br/>
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
