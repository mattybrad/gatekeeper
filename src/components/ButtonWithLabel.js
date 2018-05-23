import React from 'react';
import EmbossedLabel from './EmbossedLabel';
import Led from './Led';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <div className='patternButtonHolder' onClick={this.props.onClick}>
        <Led isOn={this.props.active} /><br/>
        <EmbossedLabel>{this.props.children}</EmbossedLabel>
      </div>
    )
  }
}

AppComponent.defaultProps = {
  active: false
};

export default AppComponent;
