import React from 'react';
import seed from 'seed-random';

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rotation: this.props.rotation || 3 * (1 - 2 * AppComponent.seededRandom()),
      translateY: 5 * AppComponent.seededRandom(),
      translateX: 3 * (1 - 2 * AppComponent.seededRandom())
    }
  }

  render() {
    var transform = 'rotate('+this.state.rotation+'deg) translate('+this.state.translateX+'px,'+this.state.translateY+'px)';
    return (
      <label className='embossedLabel' style={{transform: transform}}>{this.props.children}</label>
    );
  }
}

AppComponent.defaultProps = {
  label: 'something'
};

AppComponent.seededRandom = seed('random seeds are cool');

export default AppComponent;
