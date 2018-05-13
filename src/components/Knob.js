import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragHappening: false,
      anchorX: null,
      anchorY: null,
      initDragValue: null,
      value: 0
    }
  }

  componentDidMount() {
    this.renderCanvas();
    window.addEventListener('mouseup', this.stopListening.bind(this));
    var self = this;
    function doRender() {
      self.renderCanvas();
      window.requestAnimationFrame(doRender);
    }
    window.requestAnimationFrame(doRender);
  }

  renderCanvas() {
    var ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(ctx.canvas.width/2,ctx.canvas.width/2,ctx.canvas.width/2,0,2*Math.PI);
    ctx.fill();
    ctx.fillStyle = 'silver';
    ctx.beginPath();
    ctx.arc(ctx.canvas.width/2,ctx.canvas.width/2,ctx.canvas.width/3,0,2*Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.save();
    ctx.translate(ctx.canvas.width/2,ctx.canvas.width/2);
    ctx.rotate(1.5*Math.PI*this.state.value/100);
    ctx.translate(-ctx.canvas.width/2,-ctx.canvas.width/2);
    ctx.beginPath();
    ctx.arc(ctx.canvas.width/2,ctx.canvas.width/10,3,0,2*Math.PI);
    ctx.fill();
    ctx.restore();
  }

  startListening(ev) {
    this.handleMovement = this.handleMovement.bind(this);
    window.addEventListener('mousemove', this.handleMovement);
    this.setState({
      anchorX: ev.clientX,
      anchorY: ev.clientY,
      initDragValue: this.state.value,
      dragHappening: true
    })
  }

  stopListening() {
    window.removeEventListener('mousemove', this.handleMovement);
    this.setState({
      anchorX: null,
      anchorY: null,
      initDragValue: null,
      dragHappening: false
    })
  }

  handleMovement(ev) {
    var newValue = Math.max(0, Math.min(100, this.state.initDragValue + -2 * (ev.clientY - this.state.anchorY)));
    this.setState({
      value: newValue
    })
    console.log(newValue);
  }

  render() {
    var knobSize = 70;
    return (
      <div className='slider'>
        <canvas
          ref='canvas'
          width={knobSize}
          height={knobSize}
          onMouseDown={this.startListening.bind(this)}
        ></canvas><br/>
        <label className='embossedLabel'>knob</label>
      </div>
    );
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
