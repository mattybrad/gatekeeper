import React from 'react';
import EmbossedLabel from './EmbossedLabel';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    var startIndex = this.props.options.indexOf(this.props.start);
    this.state = {
      selectorValue: this.props.options[startIndex>=0?startIndex:0]
    }
  }

  handleSelectorChange() {
    this.props.onChange(this.props.label, this.state.selectorValue);
    this.setState({
      selectorValue: this.state.selectorValue
    })
  }

  componentDidMount() {
    this.handleSelectorChange();
    this.renderCanvas();
  }

  renderCanvas() {
    var ctx = this.refs.canvas.getContext('2d');
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
  }

  render() {
    return (
      <div className='selector'>
        <canvas ref='canvas' width={70} height={30}></canvas><br/>
        <EmbossedLabel>{this.props.label}</EmbossedLabel>
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
