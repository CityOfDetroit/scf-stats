import React, { Component } from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import Card, { CardHeader, CardContent } from 'material-ui/Card';

import AllIssuesTable from './AllIssuesTable';

class AllIssuesSummary extends Component {
  render() {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', }}>
          <Card style={{ margin: '1em' }}>
            <CardHeader title="Total tickets created" />
            <CardContent style={{ fontSize: '1.5em' }}>
              {numeral(_.sumBy(this.props.issues, function(i) { return parseInt(i.created_count, 10); })).format('0,0')}
            </CardContent>
          </Card>
          <Card style={{ margin: '1em' }}>
            <CardHeader title="Total tickets closed" />
            <CardContent style={{ fontSize: '1.5em' }}>
              <span style={{ marginRight: '.25em' }}>{numeral(_.sumBy(this.props.issues, function(i) { return parseInt(i.closed_count, 10); })).format('0,0')}</span>
              ({_.round((_.sumBy(this.props.issues, function(i) { return parseInt(i.closed_count, 10); })/_.sumBy(this.props.issues, function(i) { return parseInt(i.created_count, 10); }))*100, 2)}%)
            </CardContent>
          </Card>
          <Card style={{ margin: '1em' }}>
            <CardHeader title="Total tickets reopened" />
            <CardContent style={{ fontSize: '1.5em' }}>
              <span style={{ marginRight: '.25em' }}>{numeral(_.sumBy(this.props.issues, function(i) { return parseInt(i.reopened_count, 10); })).format('0,0')}</span>
              ({_.round((_.sumBy(this.props.issues, function(i) { return parseInt(i.reopened_count, 10); })/_.sumBy(this.props.issues, function(i) { return parseInt(i.created_count, 10); }))*100, 2)}%)
            </CardContent>
          </Card>
        </div>
        <AllIssuesTable issues={this.props.issues} />
      </div>
    );
  }
}

export default AllIssuesSummary;
