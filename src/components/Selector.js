import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    var startIndex = this.props.options.indexOf(this.props.start);
    this.state = {
      selectorValue: this.props.options[startIndex>=0?startIndex:0]
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
        <label className='embossedLabel'>{this.props.label}</label><br/>
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
