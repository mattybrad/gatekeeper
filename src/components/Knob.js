import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    var ctx = this.refs.canvas.getContext('2d');
    ctx.fillRect(0,0,100,100);
  }

  render() {
    var knobSize = 70;
    return (
      <div className='slider'>
        <canvas ref='canvas' width={knobSize} height={knobSize}></canvas><br/>
        <label className='embossedLabel'>knob</label>
      </div>
    );
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
