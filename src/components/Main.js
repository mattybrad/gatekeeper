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
import SlideSwitch from './SlideSwitch';
import Markdown from 'react-remarkable';
import testMD from '../markdown/test1.md';

/*var refList = [
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
  'distilled classical',
  'train station'
];*/
var audioSources = {
  one: require('../audio/source1.mp3'),
  two: require('../audio/source2.mp3'),
  three: require('../audio/source3.mp3')
};

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    var numPatterns = 3;
    var patternArray = [];
    for(var i = 0; i<numPatterns; i++) {
      patternArray[i] = [
        [],[],[]
      ];
    }
    this.state = {
      audioSourceReady: false,
      currentSource: 'one',
      patternIndex: 0,
      patterns: patternArray,
      timeSignature: 4,
      speed: 1
    }
    this.player = new Tone.Player();
    this.dryMix = new Tone.Volume().toMaster();
    this.wetMix = new Tone.Volume();
    this.player.connect(this.dryMix);
    this.player.connect(this.wetMix);
  }

  loadAudioSource(sourceName) {
    this.player.load(audioSources[sourceName], function(){
      this.player.loop = true;
      this.player.start();
    }.bind(this));
  }

  addNote(channelIndex, time) {
    var newPatterns = this.state.patterns.slice();
    var newPattern = newPatterns[this.state.patternIndex].slice();
    var newChannelNotes = newPattern[channelIndex].slice();
    newChannelNotes.push(time);
    newPattern[channelIndex] = newChannelNotes;
    newPatterns[this.state.patternIndex] = newPattern;
    this.setState({
      patterns: newPatterns
    })
  }

  removeNote(channelIndex, time) {
    var newPatterns = this.state.patterns.slice();
    var newPattern = newPatterns[this.state.patternIndex].slice();
    var newChannelNotes = [];
    for(var i = 0; i < this.state.patterns[this.state.patternIndex][channelIndex].length; i++) {
      if(this.state.patterns[this.state.patternIndex][channelIndex][i] != time) newChannelNotes.push(this.state.patterns[this.state.patternIndex][channelIndex][i]);
    }
    newPattern[channelIndex] = newChannelNotes;
    newPatterns[this.state.patternIndex] = newPattern;
    this.setState({
      patterns: newPatterns
    });
  }

  componentDidMount() {
    this.loadAudioSource(this.state.currentSource);

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = '0:0';
    Tone.Transport.loopEnd = '1:0';
    Tone.Transport.start();

    this.setState({
      audioSourceReady: true
    })
  }

  updateParam(param, value) {
    // should probs be doing all of this stuff in componentDidUpdate
    // will sort it out later, about to go to pub
    switch(param) {
      case 'volume':
      Tone.Master.volume.value = value;
      Tone.Master.mute = (value <= -24);
      break;

      case 'tempo':
      Tone.Transport.bpm.rampTo(value, 0.5);
      break;

      case 'mix':
      this.dryMix.volume.value = 36*(1-value) - 36;
      this.wetMix.volume.value = 26*value - 24;
      break;

      case 'speed':
      this.setState({
        speed: value
      })
      this.player.playbackRate = value;
      break;

      case 'signature':
      Tone.Transport.timeSignature = value;
      Tone.Transport.loopEnd = '1:0';
      break;
    }
  }

  chooseSource(newSource, ev) {
    ev.stopPropagation();
    this.loadAudioSource(newSource);
    this.setState({
      currentSource: newSource
    })
    this.refs.sourceModal.dismiss();
  }

  showSources() {
    this.refs.sourceModal.activate();
  }

  changePattern(patternIndex) {
    this.setState({
      patternIndex: patternIndex
    })
  }

  render() {
    var sourceItems = [];
    for(var k in audioSources) {
      if(audioSources.hasOwnProperty(k)) {
        sourceItems.push(<li key={'sourceItem_'+k} onClick={this.chooseSource.bind(this,k)}>{k}</li>);
      }
    }

    return (
      <div className="index">
        <Modal ref='welcomeModal' startActive={true}>
          <div className='modalText'>
            <Markdown source={testMD} />
          </div>
        </Modal>
        <Modal ref='sourceModal'>
          <ul>
            {sourceItems}
          </ul>
        </Modal>
        <div className='topLeft'>
          <div>
            <EmbossedLabel rotation={-2}>Gatekeeper</EmbossedLabel><br/><br/>
            <EmbossedLabel rotation={3}>Folktronic Drum Machine</EmbossedLabel><br/>
            <br/><br/><br/>
            <CassetteDeck
              onEject={this.showSources.bind(this)}
              cassetteLabel={this.state.currentSource}
              speed={this.state.speed}
            />
          </div>
        </div>
        <div className='bottomLeft'>
          <Knob onChange={this.updateParam.bind(this)} label='volume' min={-24} max={2} start={0} />
          <Knob onChange={this.updateParam.bind(this)} label='mix' min={0} max={1} start={1} />
          <Knob onChange={this.updateParam.bind(this)} label='tempo' min={50} max={250} start={120} />
          <Knob onChange={this.updateParam.bind(this)} label='speed' min={0.1} max={4} start={1} />
        </div>
        <div className='right'>
          <Channel
            audioSource={this.wetMix}
            addNote={this.addNote.bind(this,0)}
            removeNote={this.removeNote.bind(this,0)}
            notes={this.state.patterns[this.state.patternIndex][0]}
            frequency={150}
            filter={'lowpass'}
          />
          <Channel
            audioSource={this.wetMix}
            addNote={this.addNote.bind(this,1)}
            removeNote={this.removeNote.bind(this,1)}
            notes={this.state.patterns[this.state.patternIndex][1]}
            frequency={600}
            Q={20}
            filter={'bandpass'}
          />
          <Channel
            audioSource={this.wetMix}
            addNote={this.addNote.bind(this,2)}
            removeNote={this.removeNote.bind(this,2)}
            notes={this.state.patterns[this.state.patternIndex][2]}
            frequency={2000}
            filter={'highpass'}
          />
          <PatternSelector numPatterns={this.state.patterns.length} activePattern={this.state.patternIndex} onChange={this.changePattern.bind(this)} />
          <SlideSwitch onChange={this.updateParam.bind(this)} label='signature' options={[4,5,6]} start={this.props.timeSignature} />
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
