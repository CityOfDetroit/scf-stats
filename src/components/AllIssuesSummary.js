import React, { Component } from 'react';
import Table from 'antd/lib/table';

class AllIssuesSummary extends Component {
  render() {
    const columns = [
      {
        title: 'Issue Type',
        dataIndex: 'request_type_title',
        key: 'request_type_title',
      }, 
      {
        title: '# Tickets Created',
        dataIndex: 'created_count',
        key: 'created_count',
        sorter: (a, b) => a.created_count - b.created_count,
        defaultSortOrder: 'descend',
      },
      {
        title: '# Tickets Closed',
        dataIndex: 'closed_count',
        key: 'closed_count',
        sorter: (a, b) => a.closed_count - b.closed_count,
      },
      {
        title: 'Average Days to Close',
        dataIndex: 'avg_days_to_close',
        key: 'avg_days_to_close',
        sorter: (a, b) => a.avg_days_to_close - b.avg_days_to_close,
      },
      {
        title: '# Tickets Reopened',
        dataIndex: 'reopened_count',
        key: 'reopened_count',
        sorter: (a, b) => a.reopened_count - b.reopened_count,
      },
    ];

    return (
      <div>
        <Table rowKey="request_type_title" dataSource={this.props.issues} columns={columns} pagination={false} />
      </div>
    );
  }
}

export default AllIssuesSummary;
