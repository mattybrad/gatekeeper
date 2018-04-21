require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Channel from './Channel';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        {this.props.channels.map(function(val,i){
          return <Channel key={i} test={val} />;
        })}
      </div>
    );
  }
}

AppComponent.defaultProps = {
  channels: ['alpha','beta','gamma']
};

export default AppComponent;
