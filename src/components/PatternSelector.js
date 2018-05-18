import React from 'react';
import PatternButton from './PatternButton';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  onButtonClick(buttonIndex) {
    this.props.onChange(buttonIndex);
  }

  render() {
    var patternButtons = [];
    for(var i=0;i<this.props.numPatterns;i++) {
      patternButtons.push(
        <PatternButton key={'button_'+i} active={this.props.activePattern==i} onClick={this.onButtonClick.bind(this,i)}>
          Pattern {i+1}
        </PatternButton>
      )
    }
    return(
      <div className='patternSelector'>
        {patternButtons}
      </div>
    )
  }
}

AppComponent.defaultProps = {
  activePattern: 0
};

export default AppComponent;
