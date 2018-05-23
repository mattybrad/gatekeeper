import React from 'react';
import EmbossedLabel from './EmbossedLabel';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragHappening: false,
      anchorX: null,
      anchorY: null,
      initDragValue: null,
      value: this.calculateRawValue(this.props.start)
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
    this.props.onChange(this.props.label, this.calculateKnobValue(this.state.value));
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
    ctx.rotate(1.5*Math.PI*(this.state.value-0.5));
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

  calculateKnobValue(raw) {
    return this.props.min + (this.props.max-this.props.min) * raw;
  }

  calculateRawValue(knobValue) {
    return (knobValue - this.props.min) / (this.props.max - this.props.min);
  }

  handleMovement(ev) {
    ev.preventDefault();
    var newValue = Math.max(0, Math.min(1, this.state.initDragValue + -0.005 * (ev.clientY - this.state.anchorY)));
    this.props.onChange(this.props.label, this.calculateKnobValue(newValue));
    this.setState({
      value: newValue
    })
  }

  render() {
    var knobSize = 70;
    return (
      <div className='knob'>
        <canvas
          ref='canvas'
          width={knobSize}
          height={knobSize}
          onMouseDown={this.startListening.bind(this)}
        ></canvas><br/>
        <EmbossedLabel>{this.props.label}</EmbossedLabel>
      </div>
    );
  }
}

AppComponent.defaultProps = {
  onChange: function(){},
  label: 'something',
  min: 0,
  max: 1,
  start: 0
};

export default AppComponent;
