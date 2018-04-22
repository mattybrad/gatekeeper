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
        <label>{this.props.label}</label>
        <select>
          <option>one</option>
          <option>two</option>
          <option>three</option>
        </select>
      </div>
    );
  }
}

AppComponent.defaultProps = {
  label: 'selector'
};

export default AppComponent;
