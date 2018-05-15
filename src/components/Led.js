import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  onClick() {
    this.props.onClick();
  }

  render() {
    var className = 'led ' + (this.props.isOn?'on':'off');
    return (
      <div style={{background:this.props.color}} onMouseUp={this.onClick.bind(this)} className={className}></div>
    );
  }
}

AppComponent.defaultProps = {
  color: '#FF0000',
  isOn: false,
  onClick: function(){}
};

export default AppComponent;
