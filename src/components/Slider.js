import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <label>Slider</label>
        <input type="range" />
      </div>
    );
  }
}

AppComponent.defaultProps = {
  
};

export default AppComponent;
