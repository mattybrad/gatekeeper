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
import ToneUtils from './ToneUtils';
import welcomeText from '../markdown/welcome.md';
import recordText from '../markdown/record.md';

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
  three: require('../audio/source3.mp3'),
  four: require('../audio/source4.mp3')
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
      masterVolume: 1,
      tempo: 120,
      mix: 1,
      speed: 1,
      playing: false,
      backwards: false,
      fast: false
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

  componentDidUpdate(prevProps, prevState) {
    if(prevState.playing != this.state.playing) {
      if(this.state.playing) this.player.start();
      else this.player.stop();
    }
    if(prevState.speed != this.state.speed || prevState.fast != this.state.fast) {
      this.player.playbackRate = this.state.speed * (this.state.fast ? 4 : 1);
    }
    if(prevState.backwards != this.state.backwards) {
      this.player.reverse = this.state.backwards;
    }
    if(prevState.timeSignature != this.state.timeSignature) {
      Tone.Transport.timeSignature = this.state.timeSignature;
      Tone.Transport.loopEnd = '1:0';
    }
    if(prevState.masterVolume != this.state.masterVolume) {
      Tone.Master.volume.value = ToneUtils.linearToDecibels(this.state.masterVolume);
    }
    if(prevState.mix != this.state.mix) {
      var crossfadeWet = Math.min(this.state.mix * 2, 1);
      var crossfadeDry = Math.min(2 - this.state.mix * 2, 1);
      this.wetMix.volume.value = ToneUtils.linearToDecibels(1.5 * crossfadeWet);
      this.dryMix.volume.value = ToneUtils.linearToDecibels(0.2 * crossfadeDry);
    }
    if(prevState.tempo != this.state.tempo) {
      Tone.Transport.bpm.rampTo(this.state.tempo, 0.5);
    }
  }

  updateParam(param, value) {
    // should probs be doing all of this stuff in componentDidUpdate
    // will sort it out later, about to go to pub
    switch(param) {
      case 'volume':
      this.setState({
        masterVolume: value
      });
      break;

      case 'tempo':
      this.setState({
        tempo: value
      });
      break;

      case 'mix':
      this.setState({
        mix: value
      });
      break;

      case 'speed':
      this.setState({
        speed: value
      });
      break;

      case 'signature':
      this.setState({
        timeSignature: value
      });
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
    this.setState({
      playing: false
    })
  }

  showHelp() {
    this.refs.welcomeModal.activate();
  }

  showRecordMessage() {
    this.refs.recordModal.activate();
  }

  playTape() {
    this.setState({
      playing: true,
      backwards: false,
      fast: false
    })
  }

  pauseTape() {
    this.setState({
      playing: false
    })
  }

  rewindTape() {
    this.setState({
      playing: true,
      backwards: true,
      fast: false
    })
  }

  fastForwardTape() {
    this.setState({
      playing: true,
      backwards: false,
      fast: true
    })
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
            <Markdown source={welcomeText} />
          </div>
        </Modal>
        <Modal ref='recordModal'>
          <div className='modalText'>
            <Markdown source={recordText} />
          </div>
        </Modal>
        <Modal ref='sourceModal'>
          <ul>
            {sourceItems}
          </ul>
        </Modal>
        <div className='topLeft'>
          <div>
            <div className='title' onClick={this.showHelp.bind(this)}>
              <EmbossedLabel rotation={-2}>Gatekeeper</EmbossedLabel><br/><br/>
              <EmbossedLabel rotation={3}>Folktronic Drum Machine</EmbossedLabel><br/>
            </div>
            <CassetteDeck
              onRecord={this.showRecordMessage.bind(this)}
              onPlay={this.playTape.bind(this)}
              onRewind={this.rewindTape.bind(this)}
              onFastForward={this.fastForwardTape.bind(this)}
              onEject={this.showSources.bind(this)}
              onPause={this.pauseTape.bind(this)}
              cassetteLabel={this.state.currentSource}
              speed={this.state.speed*(this.state.fast?3:1)*(this.state.backwards?-1:1)}
              playing={this.state.playing}
            />
          </div>
        </div>
        <div className='bottomLeft'>
          <Knob onChange={this.updateParam.bind(this)} label='volume' min={0} max={1} start={1} />
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
          <SlideSwitch onChange={this.updateParam.bind(this)} label='signature' options={[4,5,6]} start={this.state.timeSignature} />
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
