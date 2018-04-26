import React, { Component } from 'react';
import _ from 'lodash';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import Helpers from '../helpers';

class AllIssuesTable extends Component {
  render() {

    return (
      <Table style={{ marginTop: '1em' }}>
        <TableHead >
          <TableRow>
            <TableCell style={{ fontSize: '1em', color: '#000', fontWeight: 700 }}>Issue type</TableCell>
            <TableCell numeric style={{ fontSize: '1em', color: '#000' }}>Service Level Agreement (days)</TableCell>
            <TableCell numeric style={{ fontSize: '1em', color: '#000' }}>Tickets opened</TableCell>
            <TableCell numeric style={{ fontSize: '1em', color: '#000' }}>Tickets closed</TableCell>
            <TableCell numeric style={{ fontSize: '1em', color: '#000' }}>Average days to close</TableCell>
            <TableCell numeric style={{ fontSize: '1em', color: '#000' }}>Tickets reopened</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.issues.map(i => {
            return (
              <TableRow key={i.request_type_title}>
                <TableCell>{i.request_type_title}</TableCell>
                <TableCell numeric>{Helpers.slas[i.request_type_title]}</TableCell>
                <TableCell numeric>{i.created_count}</TableCell>
                <TableCell numeric>{i.closed_count}</TableCell>
                <TableCell numeric>{ i.avg_days_to_close > 0 ? _.round(i.avg_days_to_close, 2) : null }</TableCell>
                <TableCell numeric>{i.reopened_count}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default AllIssuesTable; 
