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
    var raw = this.refs.sliderInput.value;
    var calculated = this.calculateSliderValue(this.refs.sliderInput.value);
    this.props.onChange(this.props.label, calculated);
    this.setState({
      rawSliderValue: raw,
      calculatedSliderValue: calculated
    })
  }

  render() {
    return (
      <div className='slider'>
        <label>{this.props.label}</label>
        <input
          ref='sliderInput'
          type="range"
          min={0}
          max={10000}
          defaultValue={5000}
          value={this.state.sliderValue}
          onMouseMove={this.handleSliderChange.bind(this)}
          onChange={this.handleSliderChange.bind(this)}
          />
      </div>
    );
  }
}

AppComponent.defaultProps = {
  label: 'slider',
  min: 0,
  max: 1,
  start: 0,
  onChange: function(){}
};

export default AppComponent;
