import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 0
    }
  }

  handleSliderChange() {
    this.setState(prevState => ({
      sliderValue: this.props.min + (this.props.max-this.props.min) * this.refs.sliderInput.value / 10000
    }))
  }

  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <input
          ref='sliderInput'
          type="range"
          min={0}
          max={10000}
          onMouseMove={this.handleSliderChange.bind(this)}
          />
        <span>{this.state.sliderValue}</span>
      </div>
    );
  }
}

AppComponent.defaultProps = {
  label: 'slider',
  min: 0,
  max: 1
};

export default AppComponent;
