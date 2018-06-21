import React from 'react';
import EmbossedLabel from './EmbossedLabel';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    var startIndex = this.getOptionIndex(this.props.start);
    this.state = {
      selectorValue: this.props.options[startIndex>=0?startIndex:0]
    }
  }

  getOptionIndex(value) {
    return this.props.options.indexOf(value);
  }

  handleSelectorChange() {
    this.props.onChange(this.props.label, this.state.selectorValue);
    this.setState({
      selectorValue: this.state.selectorValue
    })
    this.renderCanvas();
  }

  tempOnClick() {
    this.setState({
      selectorValue: this.props.options[(this.getOptionIndex(this.state.selectorValue)+1)%this.props.options.length]
    }, this.handleSelectorChange.bind(this));
  }

  componentDidMount() {
    this.handleSelectorChange();
    this.renderCanvas();
  }

  renderCanvas() {
    var ctx = this.refs.canvas.getContext('2d');
    var borderWidth = 0.15 * ctx.canvas.height;
    var innerWidth = ctx.canvas.width - 2 * borderWidth;
    var innerHeight = ctx.canvas.height - 2 * borderWidth;

    // draw background
    ctx.fillStyle = '#111';
    this.drawRoundedRect(ctx,0,0,ctx.canvas.width,ctx.canvas.height,5);
    ctx.fill();

    // draw inner background
    ctx.fillStyle = '#000';
    this.drawRoundedRect(ctx,borderWidth,borderWidth,innerWidth,innerHeight,5);
    ctx.fill();

    // draw switch itself
    ctx.fillStyle = '#333';
    var switchX = borderWidth + this.getOptionIndex(this.state.selectorValue) * (innerWidth - innerHeight) / Math.max(1, this.props.options.length - 1);
    this.drawRoundedRect(ctx,switchX,borderWidth,innerHeight,innerHeight,2);
    ctx.fill();
    ctx.fillStyle = '#000';
    var stripeWidth = 2;
    for(var i = 0; i < innerHeight / stripeWidth / 2; i ++) {
      ctx.fillRect(switchX + i * stripeWidth * 2, borderWidth, stripeWidth, innerHeight);
    }
  }

  drawRoundedRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y,   x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x,   y+h, r);
    ctx.arcTo(x,   y+h, x,   y,   r);
    ctx.arcTo(x,   y,   x+w, y,   r);
    ctx.closePath();
  }

  render() {
    return (
      <div className='slideSwitch'>
        <canvas ref='canvas' width={70} height={30} onClick={this.tempOnClick.bind(this)}></canvas><br/>
        <EmbossedLabel info={this.props.info}>{this.props.label}</EmbossedLabel>
      </div>
    );
  }
}

AppComponent.defaultProps = {
  label: 'selector',
  options: ['default'],
  onChange: function(){}
};

export default AppComponent;
