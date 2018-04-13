import React, { Component } from 'react';
import _ from 'lodash';
import { BarChart, Bar, XAxis, YAxis, Label } from 'recharts';

class IssueChart extends Component {
  /**
   * Get unique values for a specific key and sum their occurances
   * @param {array} data - 311 tickets json
   * @param {string} key 
   * @returns {array} - array of objects like { name: '', value: 0 }
   */
  groupData(data, key) {
    return _.chain(data)
      .groupBy(d => d[key])
      .map((v, k) => ({ name: k, value: v.length }))
      .value();
  }

  render() {
    return (
      <BarChart width={730} height={250} data={this.groupData(this.props.data, 'council_district')} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name">
          <Label value="Council District" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    );
  }
}

export default IssueChart;
