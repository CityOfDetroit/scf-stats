import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

import './styles/App.css';
import IssuePicker from './components/IssuePicker';
import DatePicker from './components/DatePicker';
import AllIssuesSummary from './components/AllIssuesSummary';
import IssueSummary from './components/IssueSummary';
import TopNav from './components/TopNav';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultWeeks: 3,
      defaultIssueType: '*',
      startDate: '',
      endDate: '',
      data: [],
      fetchedData: false,
    }

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleIssueTypeChange = this.handleIssueTypeChange.bind(this);
  }

  handleDateChange = event => {
    if (event.target.value) {
      this.fetchAllIssueTypes(event.target.value);
      this.setState({ defaultWeeks: event.target.value });
    }
  }

  handleIssueTypeChange = event => {
    if (event.target.value) {
      this.setState({ defaultIssueType: event.target.value });
    }
  }

  /**
   * Query Improve Detroit for all issue types submitted during a certain timeframe and get summary counts
   * @param {int} - number of weeks 
   * @returns {promise}
   */
  fetchAllIssueTypes(numWeeks) {
    let start = moment().subtract(numWeeks, 'week').format('YYYY-MM-DD');
    let end = moment().format('YYYY-MM-DD');
    console.log(`Fetching data for last ${numWeeks} weeks:`, start, '-', end);

    fetch(`https://data.detroitmi.gov/resource/a9kb-mhiu.json?$query=SELECT request_type_title, COUNT(created_at) AS created_count, COUNT(closed_at) AS closed_count, AVG(days_to_close) AS avg_days_to_close, COUNT(reopened_at) as reopened_count WHERE created_at between '${start}' and '${end}' GROUP BY request_type_title`)
    .then(res => res.json())
    .then(d => {
      this.setState({
        startDate: start,
        endDate: end,
        data: _.sortBy(d, d => d.request_type_title),
        fetchedData: true,
      });
    })
    .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchAllIssueTypes(this.state.defaultWeeks);
  }

  render() {
    let currentTypeSummary = _.find(this.state.data, ['request_type_title', this.state.defaultIssueType]);

    return (
      <div>
        <TopNav />
        { this.state.fetchedData ? 
          <div style={{ flexGrow: 1 }}>
            <AppBar position="static" color="default">
              <Toolbar style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '1em', marginBottom: '1em' }}>
                <div>
                  <Typography variant="title" color="inherit">
                    Pick an issue type and timeframe for analysis:
                  </Typography>
                </div>
                <div style={{ marginTop: '1em' }}>
                  <IssuePicker default={this.state.defaultIssueType} issues={this.state.data} onChange={this.handleIssueTypeChange} />
                  <DatePicker weeks={this.state.defaultWeeks} onChange={this.handleDateChange} />
                </div>
              </Toolbar>
            </AppBar>
            <Typography variant="title" color="inherit" style={{ margin: '1em' }}>
              Showing <strong>{ this.state.defaultIssueType === '*' ? 'All Issue Types' : `${this.state.defaultIssueType}` }</strong> from {moment(this.state.startDate, "YYYY-MM-DD").format("MM-DD-YY")} to {moment(this.state.endDate, "YYYY-MM-DD").format("MM-DD-YY")}
            </Typography>
          </div>
        : <p>Loading...</p> }
        { this.state.fetchedData && this.state.defaultIssueType === '*' ? <AllIssuesSummary issues={this.state.data} /> : null }
        { this.state.fetchedData && this.state.defaultIssueType !== '*' && currentTypeSummary ? <IssueSummary type={this.state.defaultIssueType} summary={currentTypeSummary} start={this.state.startDate} end={this.state.endDate} /> : null }
      </div>
    );
  }
}

export default App;
