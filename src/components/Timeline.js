import React from 'react';

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

  renderCanvas() {
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    this.ctx.fillStyle = 'turquoise';
    for(var i=0; i<16; i++) {
      this.ctx.fillRect(i*this.ctx.canvas.width/16,0,1,this.ctx.canvas.height);
    }
    for(var i=0; i<this.props.notes.length; i++) {
      this.ctx.fillRect(this.props.notes[i]*this.ctx.canvas.width/4,0,5,this.ctx.canvas.height);
    }
  }

  render() {
    return (
      <canvas ref='canvas' width={800} height={50}></canvas>
    );
  }
}

AppComponent.defaultProps = {
  notes: []
};

export default AppComponent;
