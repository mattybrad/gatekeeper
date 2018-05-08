import React from 'react';

var cassetteReference = require('../images/cassette.jpg');

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
    this.refImg = new Image();
    this.refImg.src = cassetteReference;
    window.requestAnimationFrame(doRender);
  }

  renderCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.width);
    //this.drawSpool(100,100);
    //this.drawSpool(300,100);
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    this.ctx.drawImage(this.refImg, 0, 0);
    this.ctx.restore();
    this.drawCassette(0, 0, 340, 213);
  }

  drawCassette(x, y, w, h) {
    this.ctx.strokeStyle = 'white';
    this.drawRoundedRect(this.ctx, x, y, w, h, w/50);
    this.ctx.stroke();
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

  drawSpool(x, y) {
    var tapeRadius = 80;
    var outerRadius = 30;
    var innerRadius = 25;
    var spikeLength = 7;
    var spikeHeight = 7;
    var spikeOverlap = (outerRadius - innerRadius) / 2;

    this.ctx.beginPath();
    this.ctx.arc(x, y, tapeRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#000';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(x, y, innerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#333';
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
