import React from 'react';
import Slider from './Slider';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        {'Channel ' + this.props.test}
        <Slider label='frequency' min={20} max={10000} />
        <Slider label='attack' min={0} max={2} />
        <Slider label='decay' min={0} max={2} />
        <Slider label='sustain' min={0} max={1} />
        <Slider label='release' min={0} max={5} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
  test: 'nothing'
};

export default AppComponent;
