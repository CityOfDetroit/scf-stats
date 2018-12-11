import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import Card, { CardHeader, CardContent } from 'material-ui/Card';

import IssueChart from './IssueChart';
import Helpers from '../helpers';

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
    fetch(`https://data.detroitmi.gov/resource/a9kb-mhiu.json?$limit=50000&$where=request_type_title = '${type}' AND created_at between '${moment(start).format('YYYY-MM-DD')}' and '${moment(end).format('YYYY-MM-DD')}'`)
    .then(res => res.json())
    .then(d => {
      this.setState({
        data: Helpers.checkSla(d, type),
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
              <CardHeader title="Tickets opened" />
              <CardContent style={{ fontSize: '1.5em', fontWeight: 700 }}>
                {this.props.summary.created_count}
              </CardContent>
            </Card>
            <Card style={{ margin: '1em' }}>
              <CardHeader title="Tickets closed" />
              <CardContent style={{ fontSize: '1.5em' }}>
                <span style={{ marginRight: '.25em', fontWeight: 700 }}>
                  {this.props.summary.closed_count}
                </span>
                <span style={{ color: '#878787' }}>
                  ({_.round((this.props.summary.closed_count/this.props.summary.created_count)*100, 2)}%)
                </span>
              </CardContent>
            </Card>
            <Card style={{ margin: '1em' }}>
              <CardHeader title="Tickets reopened" />
              <CardContent style={{ fontSize: '1.5em' }}>
                <span style={{ marginRight: '.25em', fontWeight: 700 }}>
                  {this.props.summary.reopened_count}
                </span>
                <span style={{ color: '#878787' }}>
                  ({_.round((this.props.summary.reopened_count/this.props.summary.created_count)*100, 2)}%)
                </span>
              </CardContent>
            </Card>
          </div>
          : null }
        {(Helpers.slas[this.props.type] > 0 && this.state.fetchedData) ? 
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', }}>
            <Card style={{ margin: '1em', backgroundColor: '#f1f1f1' }}>
              <CardHeader title="Service Level Agreement" />
              <CardContent style={{ fontSize: '1.5em', fontWeight: 700 }}>
                {Helpers.slas[this.props.type]} days
              </CardContent>
            </Card>
            <Card style={{ margin: '1em', backgroundColor: '#f1f1f1' }}>
              <CardHeader title="Tickets closed within SLA" />
              <CardContent style={{ fontSize: '1.5em', }}>
                <span style={{ marginRight: '.25em', fontWeight: 700 }}>
                  {_.sumBy(this.state.data, 'closed_within_sla')}
                </span>
                <span style={{ color: '#878787' }}>
                  ({_.round((_.sumBy(this.state.data, 'closed_within_sla')/this.props.summary.closed_count)*100, 1)}%)
                </span>
              </CardContent>
            </Card>
          </div>
          : null}
        {this.state.fetchedData ? <IssueChart data={this.state.data} /> : null}
      </div>
    );
  }
}

export default IssueSummary;
