import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';

import './App.css';

import IssuePicker from './components/IssuePicker';
import DatePicker from './components/DatePicker';
import IssuesSummary from './components/IssuesSummary';

class App extends Component {
  constructor() {
    super()

    this.state = {
      defaultWeeks: 3,
      defaultIssueType: '*',
      data: [],
      fetchedData: false,
    }

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleIssueTypeChange = this.handleIssueTypeChange.bind(this);
  }

  handleDateChange(value) {
    if (value) {
      this.fetchIssues(value);
      this.setState({ defaultWeeks: value });
    }
  }

  handleIssueTypeChange(value) {
    console.log(`selected ${value}`);
  }

  fetchIssues(week) {
    let start = moment().subtract(week, 'week').format('YYYY-MM-DD');
    let end = moment().format('YYYY-MM-DD');
    console.log(`Fetching data for last ${week} weeks:`, start, '-', end);

    fetch(`https://data.detroitmi.gov/resource/a9kb-mhiu.json?$query=SELECT request_type_title, COUNT(created_at) AS created_count, COUNT(closed_at) as closed_count, AVG(days_to_close) as avg_days_to_close WHERE created_at between '${start}' and '${end}' GROUP BY request_type_title`)
    .then(res => res.json())
    .then(d => {
      this.setState({
        data: _.sortBy(d, d => d.request_type_title),
        fetchedData: true,
      });
    })
    .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchIssues(this.state.defaultWeeks);
  }

  render() {
    return (
      <div style={{ margin: '1.5em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Analyze Improve Detroit Issues...</h1>
        { this.state.fetchedData ? 
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <IssuePicker issues={this.state.data} onChange={this.handleIssueTypeChange} />
            <DatePicker weeks={this.state.defaultWeeks} onChange={this.handleDateChange} />
          </div>
          <div>
            <IssuesSummary issues={this.state.data} />
          </div>
        </div>
        : <p>Loading...</p> }
      </div>
    );
  }
}

export default App;
