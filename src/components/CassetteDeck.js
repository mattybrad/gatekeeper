import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    this.ctx = this.refs.canvas.getContext('2d');
    var self = this;
    function doRender() {
      self.renderCanvas();
      window.requestAnimationFrame(doRender);
    }
    window.requestAnimationFrame(doRender);
  }

  renderCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.width);
    this.drawSpool(100,100);
  }

  drawSpool(x, y) {
    var outerRadius = 50;
    var innerRadius = 40;
    var spikeLength = 10;
    var spikeHeight = 10;
    var spikeOverlap = (outerRadius - innerRadius) / 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#000';
    this.ctx.fill();
    this.ctx.fillStyle = '#FFF';
    this.ctx.save();
    var initAngle = (Date.now() / 1000) % (2 * Math.PI);
    for(var i = 0; i < 6; i ++) {
      this.ctx.translate(x, y);
      this.ctx.rotate(2 * Math.PI / 6 + (i == 0 ? initAngle : 0));
      this.ctx.translate(-x, -y);
      this.ctx.fillRect(x-innerRadius-spikeOverlap, y-spikeHeight / 2, spikeLength+spikeOverlap, spikeHeight);
    }
    this.ctx.restore();
  }

  render() {
    return (
      <canvas ref='canvas' width={640} height={480}></canvas>
    );
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
