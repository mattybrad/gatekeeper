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
      <div className='patternButtonHolder'>
        <Led/><br/>
        <EmbossedLabel>{this.props.children}</EmbossedLabel>
      </div>
    )
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
