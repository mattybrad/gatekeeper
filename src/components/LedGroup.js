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
    return splitTime[1] + splitTime[2] / 4;
  }

  render() {
    var leds = [];
    for(var i=0;i<16;i++) {
      leds.push(<Led/>);
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
