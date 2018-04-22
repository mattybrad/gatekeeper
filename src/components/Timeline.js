import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [0,1,2,3,3.5]
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
    this.ctx.fillStyle = 'turquoise';
    this.ctx.fillRect(800*Math.random(),50*Math.random(),5,5);
  }

  render() {
    return (
      <canvas ref='canvas' width={800} height={50}></canvas>
    );
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
