import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    var ctx = this.refs.canvas.getContext('2d');
    ctx.fillRect(0,0,640,480);
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
