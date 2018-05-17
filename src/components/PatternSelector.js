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
    return(
      <div>
        <PatternButton active={this.props.activePattern==0} onClick={this.onButtonClick.bind(this,0)}>Pattern 1</PatternButton>
        <PatternButton active={this.props.activePattern==1} onClick={this.onButtonClick.bind(this,1)}>Pattern 2</PatternButton>
        <PatternButton active={this.props.activePattern==2} onClick={this.onButtonClick.bind(this,2)}>Pattern 3</PatternButton>
        <PatternButton active={this.props.activePattern==3} onClick={this.onButtonClick.bind(this,3)}>Pattern 4</PatternButton>
      </div>
    )
  }
}

AppComponent.defaultProps = {
  activePattern: 0
};

export default AppComponent;
