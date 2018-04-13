import React, { Component } from 'react';
import _ from 'lodash';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import IssueChart from './IssueChart';

class IssueSummary extends Component {
  constructor(props) {
    super(props);

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
        {this.props.summary ?
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', }}>
            <Card style={{ margin: '1em' }}>
              <CardHeader title="Tickets created" />
              <CardContent style={{ fontSize: '1.5em' }}>
                {this.props.summary.created_count}
              </CardContent>
            </Card>
            <Card style={{ margin: '1em' }}>
              <CardHeader title="Tickets closed" />
              <CardContent style={{ fontSize: '1.5em' }}>
                <span style={{ marginRight: '.25em' }}>{this.props.summary.closed_count}</span>
                ({_.round((this.props.summary.closed_count/this.props.summary.created_count)*100, 2)}%)
              </CardContent>
            </Card>
            <Card style={{ margin: '1em' }}>
              <CardHeader title="Tickets reopened" />
              <CardContent style={{ fontSize: '1.5em' }}>
                <span style={{ marginRight: '.25em' }}>{this.props.summary.reopened_count}</span>
                ({_.round((this.props.summary.reopened_count/this.props.summary.created_count)*100, 2)}%)
              </CardContent>
            </Card>
          </div>
        : null }
        { this.state.fetchedData ? <IssueChart data={this.state.data} /> : null }
      </div>
    );
  }
}

export default IssueSummary;
