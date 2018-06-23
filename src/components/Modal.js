import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.startActive
    }
  }

  dismiss() {
    this.setState({
      active: false
    })
  }

  activate() {
    this.setState({
      active: true
    })
  }

  stopPropagation(ev) {
    ev.stopPropagation();
  }

  render() {
    if(this.state.active) {
      return(
        <div className='modalBackground' onClick={this.dismiss.bind(this)}>
          <div className='modalDialog' onClick={this.stopPropagation}>
            <div className='modalScrollContent'>
              {this.content || this.props.children}
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}

AppComponent.defaultProps = {
  startActive: false
};

export default AppComponent;
