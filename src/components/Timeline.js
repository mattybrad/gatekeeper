import React from 'react';
import Tone from 'tone';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    function next() {
      this.renderCanvas();
      window.requestAnimationFrame(next.bind(this));
    }
    window.requestAnimationFrame(next.bind(this));
  }

  convertToBeatsOnly(rawTime) {
    var splitTime = rawTime.split(':');
    return splitTime[1] + splitTime[2] / 4;
  }

  renderCanvas() {
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    this.ctx.fillStyle = 'turquoise';
    for(var i=0; i<16; i++) {
      this.ctx.fillRect(i*this.ctx.canvas.width/16,0,1,this.ctx.canvas.height);
    }
    for(var i=0; i<this.props.notes.length; i++) {
      this.ctx.fillRect(
        this.convertToBeatsOnly(this.props.notes[i])*this.ctx.canvas.width / 4,
        0,
        5,
        this.ctx.canvas.height
      );
    }
    this.ctx.fillRect(Tone.Transport.progress*this.ctx.canvas.width,0.9*this.ctx.canvas.height,2,this.ctx.canvas.height);
  }

  handleCanvasClick(ev) {
    this.props.onNewNote('0:0:' + 16 * ev.nativeEvent.offsetX / this.ctx.canvas.width);
  }

  render() {
    return (
      <canvas ref='canvas' onClick={this.handleCanvasClick.bind(this)} width={800} height={50}></canvas>
    );
  }
}

AppComponent.defaultProps = {
  notes: [],
  onNewNote: function(){}
};

export default AppComponent;
