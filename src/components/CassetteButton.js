import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {

    return (
      <div onClick={this.props.onClick} className='cassetteButton' style={{background:this.props.color}}>
        {this.props.children}
      </div>
    );
  }
}

AppComponent.defaultProps = {
  color: '#999999',
  onClick: function(){}
};

export default AppComponent;
