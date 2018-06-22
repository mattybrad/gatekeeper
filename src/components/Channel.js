import React from 'react';
import Tone from 'tone';
import SlideSwitch from './SlideSwitch';
import LedGroup from './LedGroup';
import Knob from './Knob';
import ToneUtils from './ToneUtils';
import EmbossedLabel from './EmbossedLabel';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hold: this.props.hold,
      initialised: false
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
    if((prevProps.notes.toString() != this.props.notes.toString()) || !this.state.initialised) {
      this.part.removeAll();
      for(var i=0; i<this.props.notes.length; i++) {
        this.part.add(this.props.notes[i]);
      }
      this.setState({
        initialised: true
      })
    }
    if(prevState.volume != this.state.volume) {
      this.volume.volume.value = ToneUtils.linearToDecibels(this.state.volume);
    }
    if(prevState.attack != this.state.attack) {
      this.ampEnv.attack = Math.max(0.0005, this.state.attack)
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
        <EmbossedLabel>{this.props.channelName}</EmbossedLabel><br/><br/>
        <LedGroup onNewNote={this.props.addNote.bind(this)} onRemoveNote={this.props.removeNote.bind(this)} notes={this.props.notes} />
        <Knob onChange={this.updateParam.bind(this)} label='volume' info='Channel volume control.' min={0} max={1} start={this.props.volume} />
        <Knob onChange={this.updateParam.bind(this)} label='freq' info='Filter cutoff frequency control - alters the frequency at which the filter operates. Behaviour will depend on the type of filter current being used (the "filter" slide switch)' min={20} max={10000} start={this.props.frequency} />
        <Knob onChange={this.updateParam.bind(this)} label='q-factor' info='Q-factor control - similar to the "resonance" control on some filters, adds a ringing effect at the cutoff frequency when in low-pass or high-pass mode, and changes the bandwidth in band-pass mode.' min={0.0001} max={30} start={this.props.Q} />
        <Knob onChange={this.updateParam.bind(this)} label='attack' info='Attack control - affects how quickly a note fades in. 0% is instant, 100% is a slow fade-in.' min={0} max={1} start={this.props.attack} />
        <Knob onChange={this.updateParam.bind(this)} label='decay' info='Decay control - affects how quickly the note drops to its sustain level after the attack phase.' min={0} max={1} start={this.props.decay} />
        <Knob onChange={this.updateParam.bind(this)} label='sustain' info='Sustain control - the volume at which the note is held after the decay phase.' min={0} max={1} start={this.props.sustain} />
        <Knob onChange={this.updateParam.bind(this)} label='hold' info='Hold control - how long the note is held after the decay phase.' min={0} max={1} start={this.props.hold} />
        <Knob onChange={this.updateParam.bind(this)} label='release' info='Release control - how quickly the note fades out to silence. 0% is instant, 100% is a long fade-out.' min={0} max={4} start={this.props.release} />
        <SlideSwitch onChange={this.updateParam.bind(this)} label='filter' info='Filter type control - the left setting is a low-pass filter (which only lets frequencies through if they are below the cutoff frequency), the middle setting is band-pass (only frequencies near the cutoff freqency are allowed through), and the right setting is a high-pass filter (only frequencies above the cutoff allowed through).' options={['lowpass','bandpass','highpass']} start={this.props.filter} />
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
  notes: [],
  channelName: 'channel'
};

export default AppComponent;
