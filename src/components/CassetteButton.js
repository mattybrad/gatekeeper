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
      <div className='cassetteButton' style={{background:this.props.color}}>
        {this.props.children}
      </div>
    );
  }
}

AppComponent.defaultProps = {
  color: '#999999'
};

export default AppComponent;
