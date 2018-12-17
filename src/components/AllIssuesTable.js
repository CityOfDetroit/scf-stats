import React, { Component } from 'react';
import _ from 'lodash';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import numeral from 'numeral';

import Helpers from '../helpers';

class AllIssuesTable extends Component {
  render() {
    const combinedData = this.props.issues.map(i => ({
      ...i,
      ...this.props.slas.find(s => s.type === i.request_type_title) 
    }));

    return (
      <Table style={{ marginTop: '1em' }}>
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f5f5' }}>
            <TableCell style={{ color: '#000', fontWeight: 700 }}>Issue type</TableCell>
            <TableCell style={{ color: '#000' }} numeric>Service Level Agreement</TableCell>
            <TableCell numeric style={{ color: '#000', fontWeight: 700 }}>Tickets closed within SLA</TableCell>
            <TableCell numeric style={{ color: '#000', borderRight: '1px solid #eee' }}>Average time to close</TableCell>
            <TableCell numeric style={{ color: '#000' }}>Tickets opened</TableCell>
            <TableCell numeric style={{ color: '#000' }}>Tickets closed</TableCell>
            <TableCell numeric style={{ color: '#000' }}>Tickets reopened</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combinedData.map(i => {
            return (
              <TableRow key={i.request_type_title}>
                <TableCell>{i.request_type_title}</TableCell>
                <TableCell numeric>{Helpers.slas[i.request_type_title] > 0 ? `${Helpers.slas[i.request_type_title]} days` : null}</TableCell>
                <TableCell style={{ fontWeight: 700 }} numeric>{i.closed_within_sla > 0 && i.closed_count > 0 ? `${_.round((i.closed_within_sla/i.closed_count)*100, 1)}%` : null}</TableCell>
                <TableCell style={{ borderRight: '1px solid #eee' }} numeric>{i.avg_days_to_close > 0 ? `${_.round(i.avg_days_to_close, 1)} days` : null}</TableCell>
                <TableCell numeric>{numeral(i.created_count).format('0,0')}</TableCell>
                <TableCell numeric>{numeral(i.closed_count).format('0,0')}</TableCell>
                <TableCell numeric>{numeral(i.reopened_count).format('0,0')}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default AllIssuesTable;
