import "./styles/App.css";

import _ from "lodash";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import moment from "moment";
import React, { Component } from "react";

import AllIssuesSummary from "./components/AllIssuesSummary";
import DatePicker from "./components/DatePicker";
import IssuePicker from "./components/IssuePicker";
import IssueSummary from "./components/IssueSummary";
import TopNav from "./components/TopNav";
import Helpers from "./helpers";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultIssueType: "*",
      startDate: moment()
        .subtract(2, "week")
        .startOf("week"), // two weeks ago Sunday
      endDate: moment()
        .subtract(1, "week")
        .endOf("week"), // last Saturday
      data: [],
      slaData: [],
      fetchedData: false,
      fetchedSlaData: false,
      focus: null
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleIssueTypeChange = this.handleIssueTypeChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
  }

  handleDateChange({ startDate, endDate }) {
    if (startDate && endDate) {
      this.fetchIssuesSummary(startDate, endDate);
      this.fetchSlas(startDate, endDate);

      this.setState({ startDate, endDate });
    }
  }

  handleIssueTypeChange = event => {
    if (event.target.value) {
      this.setState({ defaultIssueType: event.target.value });
    }
  };

  handleFocusChange(focus) {
    this.setState({ focus });
  }

  fetchIssuesSummary(start, end) {
    fetch(
      `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/improve_detroit_issues/FeatureServer/0/query?where=created_at+between+%27${moment(
        start
      ).format("YYYY-MM-DD")}%27+and+%27${moment(end).format(
        "YYYY-MM-DD"
      )}%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=request_type_title&outStatistics=%5B%7B%0D%0A%22onStatisticField%22%3A+%22created_at%22%2C%0D%0A%22outStatisticFieldName%22%3A+%22created_count%22%2C%0D%0A%22statisticType%22+%3A+%22count%22%0D%0A%7D%2C%0D%0A%7B%0D%0A%22onStatisticField%22%3A+%22closed_at%22%2C%0D%0A%22outStatisticFieldName%22%3A+%22closed_count%22%2C%0D%0A%22statisticType%22+%3A+%22count%22%0D%0A%7D%2C%0D%0A%7B%0D%0A%22onStatisticField%22%3A+%22days_to_close%22%2C%0D%0A%22outStatisticFieldName%22%3A+%22avg_days_to_close%22%2C%0D%0A%22statisticType%22+%3A+%22avg%22%0D%0A%7D%2C%0D%0A%7B%0D%0A%22onStatisticField%22%3A+%22reopened_at%22%2C%0D%0A%22outStatisticFieldName%22%3A+%22reopened_count%22%2C%0D%0A%22statisticType%22+%3A+%22count%22%0D%0A%7D%5D&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json`
    )
      .then(res => res.json())
      .then(d => {
        this.setState({
          data: _.sortBy(
            d.features.map(f => f.attributes),
            d => d.request_type_title
          ),
          fetchedData: true
        });
      })
      .catch(e => console.log(e));
  }

  fetchSlas(start, end) {
    fetch(
      `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/improve_detroit_issues/FeatureServer/0/query?where=created_at+between+%27${moment(
        start
      ).format("YYYY-MM-DD")}%27+and+%27${moment(end).format(
        "YYYY-MM-DD"
      )}%27+and+closed_at+is+not+null&outFields=request_type_title%2C+days_to_close&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=`
    )
      .then(res => res.json())
      .then(d => {
        this.setState({
          slaData: Helpers.addSla(d),
          fetchedSlaData: true
        });
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchIssuesSummary(this.state.startDate, this.state.endDate);
    this.fetchSlas(this.state.startDate, this.state.endDate);
  }

  render() {
    let currentTypeSummary = _.find(this.state.data, ["request_type_title", this.state.defaultIssueType]);

    return (
      <div>
        <TopNav />
        {this.state.fetchedData ? (
          <div style={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={1} color="default">
              <Toolbar style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", alignItems: "flex-start", marginTop: "1em", marginBottom: "1em" }}>
                <div>
                  <Typography variant="subheading" color="inherit">
                    Pick an issue type and timeframe for analysis:
                  </Typography>
                </div>
                <div style={{ marginTop: "1em" }}>
                  <IssuePicker default={this.state.defaultIssueType} issues={this.state.data} onChange={this.handleIssueTypeChange} />
                  <DatePicker
                    start={this.state.startDate}
                    end={this.state.endDate}
                    onDatesChange={this.handleDateChange}
                    focus={this.state.focus}
                    onFocusChange={this.handleFocusChange}
                  />
                </div>
              </Toolbar>
            </AppBar>
            <Typography variant="subheading" color="inherit" style={{ margin: "1em" }}>
              Showing <strong>{this.state.defaultIssueType === "*" ? "All Issue Types" : `${this.state.defaultIssueType}`}</strong> from{" "}
              {moment(this.state.startDate).format("dddd MM/DD/YYYY")} to {moment(this.state.endDate).format("dddd MM/DD/YYYY")}:
            </Typography>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {this.state.fetchedData && this.state.fetchedSlaData && this.state.defaultIssueType === "*" ? (
          <AllIssuesSummary issues={this.state.data} slas={this.state.slaData} />
        ) : null}
        {this.state.fetchedData && this.state.defaultIssueType !== "*" && currentTypeSummary ? (
          <IssueSummary type={this.state.defaultIssueType} summary={currentTypeSummary} start={this.state.startDate} end={this.state.endDate} />
        ) : null}
        <Typography variant="body1" style={{ margin: "1em", color: "#878787" }}>
          (Source: <a href="https://data.detroitmi.gov/datasets/improve-detroit-issues/">Improve Detroit Issues open data</a>)
        </Typography>
      </div>
    );
  }
}

export default App;
