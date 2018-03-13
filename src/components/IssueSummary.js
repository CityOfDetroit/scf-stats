import React, { Component } from 'react';

class IssueSummary extends Component {
  constructor() {
    super()

    this.state = {
      data: [],
      fetchedData: false
    }
  }

  fetchData() {
    console.log(this.props.type)
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <div>
        <h3>{this.props.type}</h3>
      </div>
    );
  }
}

export default IssueSummary;
