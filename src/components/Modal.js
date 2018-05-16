import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleBackgroundClick() {
    this.props.onDismiss();
  }

  render() {
    return(
      <div className='modalBackground' onClick={this.handleBackgroundClick.bind(this)}>
        <div className='modalDialog'>
          <div className='modalScrollContent'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

AppComponent.defaultProps = {
  onDismiss: function(){}
};

export default AppComponent;
