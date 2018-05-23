import React from 'react';
import Tone from 'tone';
import SlideSwitch from './SlideSwitch';
import LedGroup from './LedGroup';
import Knob from './Knob';
import ToneUtils from './ToneUtils';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hold: this.props.hold
    }
    this.ampEnv = new Tone.AmplitudeEnvelope({
      'attack': 0.001,
      'decay': 0.2,
      'sustain': 0.5,
      'release': 1.5
    });
    this.filter = new Tone.Filter(800, 'bandpass');
    this.props.audioSource.connect(this.ampEnv);
    this.ampEnv.connect(this.filter);
    this.volume = new Tone.Volume();
    this.filter.connect(this.volume);
    this.volume.toMaster();

    this.part = new Tone.Part(function(time){
      var timeBeforeRelease = this.state.attack + this.state.decay + this.state.hold;
      this.ampEnv.triggerAttackRelease(timeBeforeRelease+'s', time);
    }.bind(this), []);
    this.part.start('0:0:0');
  }

  componentDidMount() {

  }

  updateParam(param, value) {
    switch(param) {
      case 'volume':
      this.setState({
        volume: value
      });
      break;

      case 'freq':
      this.setState({
        frequency: value
      })
      break;

      case 'q-factor':
      this.setState({
        Q: value
      })
      break;

      case 'attack':
      this.setState({
        attack: value
      })
      break;

      case 'decay':
      this.setState({
        decay: value
      })
      break;

      case 'sustain':
      this.setState({
        sustain: value
      })
      break;

      case 'release':
      this.setState({
        release: value
      })
      break;

      case 'hold':
      this.setState({
        hold: value
      })
      break;

      case 'filter':
      this.setState({
        filterType: value
      })
      break;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.notes.toString() != this.props.notes.toString()) {
      this.part.removeAll();
      for(var i=0; i<this.props.notes.length; i++) {
        this.part.add(this.props.notes[i]);
      }
    }
    if(prevState.volume != this.state.volume) {
      this.volume.volume.value = ToneUtils.linearToDecibels(this.state.volume);
    }
    if(prevState.attack != this.state.attack) {
      this.ampEnv.attack = Math.max(0.0001, this.state.attack)
    }
    if(prevState.decay != this.state.decay) {
      this.ampEnv.decay = Math.max(0.0001, this.state.decay);
    }
    if(prevState.sustain != this.state.sustain) {
      this.ampEnv.sustain = this.state.sustain;
    }
    if(prevState.release != this.state.release) {
      this.ampEnv.release = Math.max(0.0001, this.state.release);
    }
    if(prevState.frequency != this.state.frequency) {
      this.filter.frequency.value = this.state.frequency;
    }
    if(prevState.Q != this.state.Q) {
      this.filter.Q.value = this.state.Q;
    }
    if(prevState.filterType != this.state.filterType) {
      this.filter.type = this.state.filterType;
    }
  }

  render() {
    return (
      <div className='channel'>
        <LedGroup onNewNote={this.props.addNote.bind(this)} onRemoveNote={this.props.removeNote.bind(this)} notes={this.props.notes} />
        <Knob onChange={this.updateParam.bind(this)} label='volume' min={0} max={1} start={this.props.volume} />
        <Knob onChange={this.updateParam.bind(this)} label='freq' min={20} max={10000} start={this.props.frequency} />
        <Knob onChange={this.updateParam.bind(this)} label='q-factor' min={0.0001} max={30} start={this.props.Q} />
        <Knob onChange={this.updateParam.bind(this)} label='attack' min={0} max={1} start={this.props.attack} />
        <Knob onChange={this.updateParam.bind(this)} label='decay' min={0} max={1} start={this.props.decay} />
        <Knob onChange={this.updateParam.bind(this)} label='sustain' min={0} max={1} start={this.props.sustain} />
        <Knob onChange={this.updateParam.bind(this)} label='hold' min={0} max={1} start={this.props.hold} />
        <Knob onChange={this.updateParam.bind(this)} label='release' min={0} max={4} start={this.props.release} />
        <SlideSwitch onChange={this.updateParam.bind(this)} label='filter' options={['lowpass','bandpass','highpass']} start={this.props.filter} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
  volume: 0.5,
  frequency: 500,
  Q: 1,
  attack: 0,
  decay: 0.2,
  sustain: 0.5,
  release: 0.7,
  hold: 0.1,
  filter: 'bandpass',
  addNote: function(){},
  removeNote: function(){},
  notes: []
};

export default AppComponent;
