import React from 'react';
import Tone from 'tone';
import Slider from './Slider';
import Selector from './Selector';
import Timeline from './Timeline';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    }
  }

  componentDidMount() {
    this.ampEnv = new Tone.AmplitudeEnvelope({
      'attack': 0.001,
      'decay': 0.2,
      'sustain': 0.5,
      'release': 1.5
    });
    this.filter = new Tone.Filter(800, 'bandpass');
    this.props.audioSource.connect(this.ampEnv);
    this.ampEnv.connect(this.filter);
    this.filter.toMaster();

    this.part = new Tone.Part(function(time){
      this.ampEnv.triggerAttackRelease('0.5s', time);
    }.bind(this), []);
    this.part.start('0:0:0');
  }

  addNote(time) {
    this.part.add(time);
    this.setState(prevState => ({
      notes: [...prevState.notes, time]
    }));
  }

  render() {
    return (
      <div>
        {'Channel ' + this.props.test}
        <Slider label='frequency' min={20} max={10000} />
        <Slider label='attack' min={0} max={2} />
        <Slider label='decay' min={0} max={2} />
        <Slider label='sustain' min={0} max={1} />
        <Slider label='release' min={0} max={5} />
        <Selector label='filter' options={['LPF','BPF','HPF']} />
        <Timeline onNewNote={this.addNote.bind(this)} notes={this.state.notes} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
  test: 'default'
};

export default AppComponent;
