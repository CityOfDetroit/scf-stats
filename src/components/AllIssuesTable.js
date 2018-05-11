import React, { Component } from 'react';
import _ from 'lodash';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import Helpers from '../helpers';

class AllIssuesTable extends Component {
  render() {
    // each should be sorted by request type before merging
    let combinedData = _.merge(this.props.issues, this.props.slas)

    return (
      <Table style={{ marginTop: '1em' }}>
        <TableHead>
          <TableRow style={{ backgroundColor: '#eee' }}>
            <TableCell style={{ fontSize: '1em', color: '#000', fontWeight: 700 }}>Issue type</TableCell>
            <TableCell numeric style={{ fontSize: '.9em', color: '#000', fontWeight: 700 }}>Service Level Agreement</TableCell>
            <TableCell numeric style={{ fontSize: '.9em', color: '#000', fontWeight: 700 }}>Tickets closed within SLA</TableCell>
            <TableCell numeric style={{ fontSize: '.9em', color: '#000', fontWeight: 700, borderRight: '1px solid #eee' }}>Average time to close</TableCell>
            <TableCell numeric style={{ fontSize: '.9em', color: '#000', fontWeight: 700 }}>Tickets opened</TableCell>
            <TableCell numeric style={{ fontSize: '.9em', color: '#000', fontWeight: 700 }}>Tickets closed</TableCell>
            <TableCell numeric style={{ fontSize: '.9em', color: '#000', fontWeight: 700 }}>Tickets reopened</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combinedData.map(i => {
            return (
              <TableRow key={i.request_type_title}>
                <TableCell style={{ fontSize: '.9em' }}>{i.request_type_title}</TableCell>
                <TableCell style={{ fontSize: '.9em' }} numeric>{Helpers.slas[i.request_type_title] > 0 ? `${Helpers.slas[i.request_type_title]} days` : null}</TableCell>
                <TableCell style={{ fontSize: '.9em', fontWeight: 700 }} numeric>{i.closed_within_sla > 0 && i.closed_count > 0 ? `${_.round((i.closed_within_sla/i.closed_count)*100, 1)}%` : null}</TableCell>
                <TableCell style={{ fontSize: '.9em', borderRight: '1px solid #eee' }} numeric>{i.avg_days_to_close > 0 ? `${_.round(i.avg_days_to_close, 2)} days` : null}</TableCell>
                <TableCell style={{ fontSize: '.9em' }} numeric>{i.created_count}</TableCell>
                <TableCell style={{ fontSize: '.9em' }} numeric>{i.closed_count}</TableCell>
                <TableCell style={{ fontSize: '.9em' }} numeric>{i.reopened_count}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default AllIssuesTable; 
