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

  render() {
    if(this.state.active) {
      return(
        <div className='modalBackground' onClick={this.dismiss.bind(this)}>
          <div className='modalDialog'>
            <div className='modalScrollContent'>
              {this.props.children}
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
