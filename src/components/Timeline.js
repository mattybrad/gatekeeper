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
    this.ctx.fillStyle = 'white';
    // draw lines to show where beats occur
    this.ctx.globalAlpha = 0.2;
    for(var i=0; i<16; i++) {
      this.ctx.fillRect(i*this.ctx.canvas.width/16,0,1,this.ctx.canvas.height);
    }
    this.ctx.globalAlpha = 1;
    for(var i=0; i<this.props.notes.length; i++) {
      this.ctx.fillRect(
        this.convertToBeatsOnly(this.props.notes[i])*this.ctx.canvas.width / 4,
        0,
        1,
        this.ctx.canvas.height
      );
    }
    this.ctx.fillRect(Tone.Transport.progress*this.ctx.canvas.width,0.9*this.ctx.canvas.height,2,this.ctx.canvas.height);
  }

  handleCanvasClick(ev) {
    var canvasBeatPosition = 4 * ev.nativeEvent.offsetX / this.ctx.canvas.width;

    // check for any previous notes
    var closestNote = null;
    var closestNoteDelta = Infinity;
    for(var i=0; i<this.props.notes.length; i++) {
      var noteDelta = Math.abs(canvasBeatPosition - this.convertToBeatsOnly(this.props.notes[i]));
      // the noteDelta threshold below should ideally be directly linked to the visual width of a note
      if(noteDelta < 0.03 && noteDelta < closestNoteDelta) closestNote = i;
    }
    if(closestNote != null) {
      // remove note
      this.props.onRemoveNote('0:0:' + 4 * this.convertToBeatsOnly(this.props.notes[closestNote]));
    } else {
      // add note
      this.props.onNewNote('0:0:' + 4 * canvasBeatPosition);
    }
  }

  render() {
    return (
      <canvas className='timeline' ref='canvas' onClick={this.handleCanvasClick.bind(this)} width={800} height={50}></canvas>
    );
  }
}

AppComponent.defaultProps = {
  notes: [],
  onNewNote: function(){},
  onRemoveNote: function(){}
};

export default AppComponent;
