import React from 'react';
import seed from 'seed-random';

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rotation: this.props.rotation || 3 * (1 - 2 * AppComponent.seededRandom()),
      translateY: 5 * AppComponent.seededRandom(),
      translateX: 3 * (1 - 2 * AppComponent.seededRandom())
    }
  }

  onClick() {
    if(this.props.info) {
      // this is definitely not the right way to do this, but it's late and i want to watch a film
      AppComponent.infoModal.content = <div className='modalText'>{this.props.info}</div>;
      AppComponent.infoModal.activate();
    }
  }

  render() {
    var transform = 'rotate('+this.state.rotation+'deg) translate('+this.state.translateX+'px,'+this.state.translateY+'px)';
    return (
      <label
        className='embossedLabel'
        style={{transform: transform}}
        onClick={this.onClick.bind(this)}
      >{this.props.children}</label>
    );
  }
}

AppComponent.defaultProps = {
  
};

AppComponent.seededRandom = seed('random seeds are cool 789');

export default AppComponent;
