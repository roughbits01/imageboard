import React from 'react/addons';

class HelloComponent extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

export default HelloComponent;
