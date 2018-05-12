import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className='led'></div>
    );
  }
}

AppComponent.defaultProps = {
  color: '#FF0000',
  isOn: false
};

export default AppComponent;
