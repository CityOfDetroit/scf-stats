import React, { Component } from 'react';

class IssueSummary extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      fetchedData: false
    }
  }

  /**
   * Query Improve Detroit for one type of issue submitted during a certain timeframe and get all ticket fields
   * @param {string} type - request type title
   * @param {string} start - start date YYYY-MM-DD
   * @param {string} end  - end date YYYY-MM-DD
   * @returns {promise}
   */
  fetchIssuesByType(type, start, end) {
    fetch(`https://data.detroitmi.gov/resource/a9kb-mhiu.json?$limit=50000&$where=request_type_title = '${type}' AND created_at between '${start}' and '${end}'`)
    .then(res => res.json())
    .then(d => {
      this.setState({
        data: d,
        fetchedData: true,
      });
    })
    .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchIssuesByType(this.props.type, this.props.start, this.props.end);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type || this.props.start !== nextProps.start) {
      this.fetchIssuesByType(nextProps.type, nextProps.start, nextProps.end);
    }
  }

  render() {
    return (
      <div>
        <h3>{this.props.type}</h3>
        { this.state.fetchedData ? <p>{`${this.state.data.length} tickets created`}</p> : <p>Loading...</p> }
      </div>
    );
  }
}

export default IssueSummary;
