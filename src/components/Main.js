require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Tone from 'tone';
import Channel from './Channel';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: []
    }
  }

  handleAddChannelClick() {
    this.setState(prevState => ({
      channels: [...prevState.channels, 'x']
    }));
  }

  componentDidMount() {
    //create a synth and connect it to the master output (your speakers)
    var synth = new Tone.Synth().toMaster();

    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease('C4', '8n');
  }

  render() {
    return (
      <div className="index">
        <div id="addChannel" onClick={this.handleAddChannelClick.bind(this)}>Add Channel</div>
        {this.state.channels.map(function(val,i){
          return <Channel key={i} test={val} />;
        })}
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
