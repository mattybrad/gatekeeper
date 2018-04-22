import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawSliderValue: 0,
      calculatedSliderValue: this.calculateSliderValue(0)
    }
  }

  calculateSliderValue(raw) {
    return this.props.min + (this.props.max-this.props.min) * raw / 10000
  }

  handleSliderChange() {
    this.setState({
      rawSliderValue: this.refs.sliderInput.value,
      calculatedSliderValue: this.calculateSliderValue(this.refs.sliderInput.value)
    })
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
          defaultValue={0}
          value={this.state.sliderValue}
          onMouseMove={this.handleSliderChange.bind(this)}
          onChange={this.handleSliderChange.bind(this)}
          />
        <span>{this.state.calculatedSliderValue}</span>
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
