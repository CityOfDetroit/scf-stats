import React, { Component } from 'react';
import _ from 'lodash';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import Helpers from '../helpers';

class AllIssuesTable extends Component {
  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Issue type</TableCell>
            <TableCell>Service Level Agreement (days)</TableCell>
            <TableCell numeric>Tickets created</TableCell>
            <TableCell numeric>Tickets closed</TableCell>
            <TableCell numeric>Average days to close</TableCell>
            <TableCell numeric>Tickets reopened</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.issues.map(i => {
            return (
              <TableRow key={i.request_type_title}>
                <TableCell>{i.request_type_title}</TableCell>
                <TableCell>{Helpers.slas[i.request_type_title]}</TableCell>
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
