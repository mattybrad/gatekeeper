import React from 'react';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {

    var className = 'cassetteButton';
    if(this.props.active) className += ' activeCassetteButton';

    return (
      <div onClick={this.props.onClick} className={className}>
        {this.props.children}
      </div>
    );
  }
}

AppComponent.defaultProps = {
  active: false,
  onClick: function(){}
};

export default AppComponent;
