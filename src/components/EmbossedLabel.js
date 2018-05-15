import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotation: 2 * (1 - 2 * Math.random()),
      translateY: 5 * Math.random(),
      translateX: 3 * (1 - 2 * Math.random())
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

export default AppComponent;
