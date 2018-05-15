import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotation: 4 * (1 - 2 * Math.random())
    }
  }

  render() {
    return (
      <label className='embossedLabel' style={{transform: 'rotate('+this.state.rotation+'deg)'}}>{this.props.children}</label>
    );
  }
}

AppComponent.defaultProps = {
  label: 'something'
};

export default AppComponent;
