import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectorValue: this.props.options[0]
    }
  }

  handleSelectorChange() {
    this.props.onChange(this.props.label, this.refs.selectorInput.value);
    this.setState({
      selectorValue: this.refs.selectorInput.value
    })
  }

  componentDidMount() {
    this.handleSelectorChange();
  }

  render() {
    return (
      <div className='selector'>
        <label>{this.props.label}</label>
        <select ref='selectorInput' value={this.state.selectorValue} onChange={this.handleSelectorChange.bind(this)}>
          {this.props.options.map(function(val,i){
            return <option key={i}>{val}</option>;
          })}
        </select>
      </div>
    );
  }
}

AppComponent.defaultProps = {
  label: 'selector',
  options: ['default'],
  onChange: function(){}
};

export default AppComponent;
