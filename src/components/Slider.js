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

  calculateRawValue(sliderValue) {
    return 10000 * (sliderValue - this.props.min) / (this.props.max - this.props.min);
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

  componentDidMount() {
    this.handleSliderChange();
  }

  render() {
    return (
      <div className='slider'>
        <input
          ref='sliderInput'
          type="range"
          min={0}
          max={10000}
          defaultValue={this.calculateRawValue(this.props.start)}
          value={this.state.sliderValue}
          onMouseMove={this.handleSliderChange.bind(this)}
          onChange={this.handleSliderChange.bind(this)}
        /><br/>
        <label className='embossedLabel'>{this.props.label}</label>
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
