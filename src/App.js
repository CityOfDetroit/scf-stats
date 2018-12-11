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
import Helpers from './helpers';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultWeeks: 3,
      defaultIssueType: '*',
      startDate: '',
      endDate: '',
      data: [],
      slaData: [],
      fetchedData: false,
      fetchedSlaData: false,
    }

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleIssueTypeChange = this.handleIssueTypeChange.bind(this);
  }

  handleDateChange = event => {
    if (event.target.value) {
      this.fetchIssuesSummary(event.target.value);
      this.fetchSlas(event.target.value);

      this.setState({ defaultWeeks: event.target.value });
    }
  }

  handleIssueTypeChange = event => {
    if (event.target.value) {
      this.setState({ defaultIssueType: event.target.value });
    }
  }

  fetchIssuesSummary(numWeeks) {
    let start = moment().subtract(numWeeks, 'week').format('YYYY-MM-DD');
    let end = moment().subtract(1, 'day').format('YYYY-MM-DD');

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

  fetchSlas(numWeeks) {
    let start = moment().subtract(numWeeks, 'week').format('YYYY-MM-DD');
    let end = moment().subtract(1, 'day').format('YYYY-MM-DD');

    fetch(`https://data.detroitmi.gov/resource/a9kb-mhiu.json?$query=SELECT request_type_title, days_to_close WHERE closed_at is not null and created_at between '${start}' and '${end}' limit 10000`)
    .then(res => res.json())
    .then(d => {
      this.setState({
        startDate: start,
        endDate: end,
        slaData: Helpers.addSla(d),
        fetchedSlaData: true,
      });
    })
    .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchIssuesSummary(this.state.defaultWeeks);
    this.fetchSlas(this.state.defaultWeeks);
  }

  render() {
    let currentTypeSummary = _.find(this.state.data, ['request_type_title', this.state.defaultIssueType]);

    return (
      <div>
        <TopNav />
        { this.state.fetchedData ? 
          <div style={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={1} color="default">
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
              Showing <strong>{ this.state.defaultIssueType === '*' ? 
                'All Issue Types' 
                : `${this.state.defaultIssueType}` }</strong> from {moment(this.state.startDate, "YYYY-MM-DD").format("MM-DD-YY")} to {moment(this.state.endDate, "YYYY-MM-DD").format("MM-DD-YY")}
            </Typography>
          </div>
        : <p>Loading...</p> }
        { this.state.fetchedData && this.state.fetchedSlaData && this.state.defaultIssueType === '*' ? 
          <AllIssuesSummary issues={this.state.data} slas={this.state.slaData} /> : null }
        { this.state.fetchedData && this.state.defaultIssueType !== '*' && currentTypeSummary ? 
          <IssueSummary type={this.state.defaultIssueType} summary={currentTypeSummary} start={this.state.startDate} end={this.state.endDate} /> : null }
        <Typography variant="body1" style={{ margin: '1em', color: '#878787' }}>
          (Source: <a href="https://data.detroitmi.gov/d/fjru-bz8m">Improve Detroit Issues open data</a>)
        </Typography>
      </div>
    );
  }
}

export default App;
