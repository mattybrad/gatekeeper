import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <div className='modalBackground'>
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

};

export default AppComponent;
