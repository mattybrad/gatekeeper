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

var defaultAudioSources = {
  'strings': require('../audio/strings.mp3'),
  'drums': require('../audio/drums.mp3'),
  'drums (hectic)': require('../audio/drums2.mp3'),
  'piano': require('../audio/piano.mp3'),
  'electric piano': require('../audio/electricpiano.mp3')
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
    patternArray[0] = [
      ['0:0:0', '0:0:8', '0:0:10'],
      ['0:0:2', '0:0:9'],
      ['0:0:4', '0:0:12']
    ];
    this.state = {
      audioSource: 'piano',
      patternIndex: 0,
      patterns: patternArray,
      loadingAudio: true,
      recordings: [],
      audioSources: defaultAudioSources
    }
    this.initToneThings();
  }

  initToneThings() {
    this.player = new Tone.Player();
    this.dryMix = new Tone.Volume().toMaster();
    this.wetMix = new Tone.Volume();
    this.player.connect(this.dryMix);
    this.player.connect(this.wetMix);
    this.recorder = new Recorder(Tone.Master);
  }

  startRecording() {
    this.recorder.record();
  }

  stopRecording() {
    this.recorder.stop();
    this.refs.recordingModal.activate();
    this.setState({
      processingRecording: true
    })
    this.recorder.exportWAV(function(data){
      var textFileURL = null;
      textFileURL = window.URL.createObjectURL(data);
      this.setState({
        processingRecording: false,
        recordings: [...this.state.recordings, textFileURL]
      })
    }.bind(this));

  }

  loadAudioSource(sourceName) {
    this.setState({
      loadingAudio: true
    })
    this.player.stop();
    this.player.load(this.state.audioSources[sourceName], function(){
      this.setState({
        loadingAudio: false
      })
      this.player.loop = true;
      if(this.state.playing) this.player.start();
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
    this.loadAudioSource(this.state.audioSource);

    Tone.Transport.loop = true;
    Tone.Transport.loopStart = '0:0';
    Tone.Transport.loopEnd = '1:0';
    Tone.Transport.start();

    EmbossedLabel.infoModal = this.refs.labelModal;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.playing != this.state.playing) {
      if(this.state.playing) {
        this.player.start();
        Tone.Transport.stop();
        Tone.Transport.start(Tone.now(), '0:0:0');
      }
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
    if(prevState.audioSource != this.state.audioSource) {
      this.loadAudioSource(this.state.audioSource);
    }
    if(prevState.recording != this.state.recording) {
      if(this.state.recording) this.startRecording();
      else this.stopRecording();
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
    this.setState({
      audioSource: newSource
    })
    this.refs.sourceModal.dismiss();
  }

  showSources() {
    this.refs.sourceModal.activate();
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

  toggleRecording() {
    this.setState({
      recording: !this.state.recording
    })
  }

  changePattern(patternIndex) {
    this.setState({
      patternIndex: patternIndex
    })
  }

  readUploadFiles() {
    var newAudioSources = Object.assign({}, this.state.audioSources);
    for(var i = 0; i < this.refs.fileChooser.files.length; i++) {
      var thisFile = URL.createObjectURL(this.refs.fileChooser.files[i]);
      newAudioSources[this.refs.fileChooser.files[i].name] = thisFile
    }
    this.setState({
      audioSources: newAudioSources
    })
  }

  render() {
    var sourceItems = [];
    sourceItems.push(
      <li key={'addSource'}>Upload audio file: <input ref='fileChooser' onChange={this.readUploadFiles.bind(this)} type="file" accept="audio/*" multiple /></li>
    );
    for(var k in this.state.audioSources) {
      if(this.state.audioSources.hasOwnProperty(k)) {
        sourceItems.push(<li key={'sourceItem_'+k} onClick={this.chooseSource.bind(this,k)}>{k}</li>);
      }
    }

    var recordingDownloads = [];
    for(var i = 0; i < this.state.recordings.length; i ++) {
      recordingDownloads.push(
        <li key={'recordings'+i}>
          <a href={this.state.recordings[i]} download={'gatekeeper_recording'+(i+1)+'.wav'}>
            {'Download recording '+(i+1)}
          </a>
        </li>
      )
    }

    var activeButtons = [];
    if(this.state.playing) {
      if(this.state.backwards) activeButtons.push('rewind');
      else if(this.state.fast) activeButtons.push('fastForward');
      else activeButtons.push('play');
    } else {
      activeButtons.push('pause');
    }
    if(this.state.recording) activeButtons.push('record');

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
        <Modal ref='recordingModal'>
          <ul>
            {recordingDownloads}
          </ul>
        </Modal>
        <Modal ref='labelModal' />
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
              onRecord={this.toggleRecording.bind(this)}
              cassetteLabel={this.state.audioSource}
              speed={this.state.speed*(this.state.fast?3:1)*(this.state.backwards?-1:1)}
              playing={this.state.playing}
              activeButtons={activeButtons}
              loadingAudio={this.state.loadingAudio}
            />
            <br/><br/>
            <PatternSelector numPatterns={this.state.patterns.length} activePattern={this.state.patternIndex} onChange={this.changePattern.bind(this)} />
            <SlideSwitch onChange={this.updateParam.bind(this)} label='signature' info='Time signature control - selects how many steps are used in the pattern. Left is 16 (4/4 time), middle is 20 (5/4 time) and right is 24 (3/4 or 6/8).' options={[4,5,6]} start={this.state.timeSignature} />
            <br/><br/><br/>
            <Knob onChange={this.updateParam.bind(this)} label='volume' info='Main volume control.' min={0} max={5} start={3} />
            <Knob onChange={this.updateParam.bind(this)} label='mix' info='Mix control - fades between the raw signal from the tape at 0% and the gated signal at 100%. Try slowly fading in the original signal for a less rhythmic sound.' min={0} max={1} start={0.95} />
            <Knob onChange={this.updateParam.bind(this)} label='tempo' info='Tempo control - alters the tempo of the pattern.' min={50} max={250} start={90} />
            <Knob onChange={this.updateParam.bind(this)} label='speed' info='Tape speed control - alters the speed of the tape motor, resulting in lower or higher pitch.' min={0.1} max={4} start={1} />
          </div>
        </div>
        <div className='right'>
          <div>
            <Channel
              channelName='Channel One'
              audioSource={this.wetMix}
              addNote={this.addNote.bind(this,0)}
              removeNote={this.removeNote.bind(this,0)}
              notes={this.state.patterns[this.state.patternIndex][0]}
              frequency={150}
              release={0.1}
              hold={0.02}
              volume={0.5}
              filter={'lowpass'}
            />
            <Channel
              channelName='Channel Two'
              audioSource={this.wetMix}
              addNote={this.addNote.bind(this,1)}
              removeNote={this.removeNote.bind(this,1)}
              notes={this.state.patterns[this.state.patternIndex][1]}
              frequency={600}
              Q={20}
              volume={0.7}
              filter={'bandpass'}
            />
            <Channel
              channelName='Channel Three'
              audioSource={this.wetMix}
              addNote={this.addNote.bind(this,2)}
              removeNote={this.removeNote.bind(this,2)}
              notes={this.state.patterns[this.state.patternIndex][2]}
              frequency={3000}
              release={3.5}
              sustain={0.3}
              volume={0.8}
              decay={0.2}
              filter={'highpass'}
            />
          </div>
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
