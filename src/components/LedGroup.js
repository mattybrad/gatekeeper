import React from 'react';
import Led from './Led';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  convertToBeatsOnly(rawTime) {
    var splitTime = rawTime.split(':');
    return parseInt(splitTime[1]) + parseInt(splitTime[2]) / 4;
  }

  onClick(ledIndex) {
    var ledBeatPosition = ledIndex / 4;

    // check for any previous notes
    var closestNote = null;
    var closestNoteDelta = Infinity;
    for(var i=0; i<this.props.notes.length; i++) {
      var noteDelta = Math.abs(ledBeatPosition - this.convertToBeatsOnly(this.props.notes[i]));
      // noteDelta used to be used because the timeline was a continuum
      // now we're using discrete leds, it doesn't make as much sense
      // but i guess we can use it to get rid of floating point errors
      // whatever, i'm leaving it for now
      if(noteDelta < 0.001 && noteDelta < closestNoteDelta) closestNote = i;
    }
    if(closestNote != null) {
      // remove note
      this.props.onRemoveNote('0:0:' + 4 * this.convertToBeatsOnly(this.props.notes[closestNote]));
    } else {
      // add note
      this.props.onNewNote('0:0:' + 4 * ledBeatPosition);
    }
  }

  render() {
    var leds = [];
    var noteExists;
    var rainbow = ['#c00','#c30','#c90','#2b2','#07b','#a3d'];

    for(var i=0;i<24;i++) {
      noteExists = false;
      for(var j=0;j<this.props.notes.length;j++){
        if(Math.round(this.convertToBeatsOnly(this.props.notes[j])*4)==i) noteExists = true;
      }
      var keyColor = rainbow[Math.floor(i/4)%rainbow.length];
      leds.push(
        <div key={i}>
          <Led isOn={noteExists} onClick={this.onClick.bind(this,i)} color='#EE0000' keyColor={keyColor} />
        </div>
      );
    }

    return (
      <div className='ledGroup'>
        {leds}
      </div>
    );
  }
}

AppComponent.defaultProps = {
  notes: [],
  onNewNote: function(){},
  onRemoveNote: function(){}
};

export default AppComponent;
