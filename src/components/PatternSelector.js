import React from 'react';
import PatternButton from './PatternButton';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <div>
        <PatternButton>Pattern 1</PatternButton>
        <PatternButton>Pattern 2</PatternButton>
        <PatternButton>Pattern 3</PatternButton>
        <PatternButton>Pattern 4</PatternButton>
      </div>
    )
  }
}

AppComponent.defaultProps = {

};

export default AppComponent;
