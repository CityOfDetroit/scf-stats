import _ from "lodash";
import Card, { CardContent, CardHeader } from "material-ui/Card";
import moment from "moment";
import numeral from "numeral";
import React, { Component } from "react";

import Helpers from "../helpers";
import IssueChart from "./IssueChart";

class IssueSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      fetchedData: false
    };
  }

  /**
   * Query Improve Detroit for one type of issue submitted during a certain timeframe and get all ticket fields
   * @param {string} type - request type title
   * @param {string} start - start date YYYY-MM-DD
   * @param {string} end  - end date YYYY-MM-DD
   * @returns {promise}
   */
  fetchIssuesByType(type, start, end) {
    let whereClause = `1=1`;
    if (type !== "*") {
      whereClause = `request_type_title%3D%27${type}%27`;
    }
    fetch(
      `https://opengis.detroitmi.gov/opengis/rest/services/DoIT/ImproveDetroitIssues/FeatureServer/0/query?where=${whereClause}+and+created_at+between+%27${moment(
        start
      ).format("YYYY-MM-DD")}%27+and+%27${moment(end).format(
        "YYYY-MM-DD"
      )}%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=`
    )
      .then(res => res.json())
      .then(d => {
        console.log(d);
        this.setState({
          data: Helpers.checkSla(
            d.features.map(f => f.attributes),
            type
          ),
          fetchedData: true
        });
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchIssuesByType(this.props.type, this.props.start, this.props.end);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type || this.props.start !== nextProps.start) {
      this.setState({ fetchedData: false });
      this.fetchIssuesByType(nextProps.type, nextProps.start, nextProps.end);
    }
  }

  render() {
    return (
      <div>
        {this.props.summary ? (
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            <Card style={{ margin: "1em" }}>
              <CardHeader title="Tickets opened" />
              <CardContent style={{ fontSize: "1.5em", fontWeight: 700 }}>{numeral(this.props.summary.created_count).format("0,0")}</CardContent>
            </Card>
            <Card style={{ margin: "1em" }}>
              <CardHeader title="Tickets closed" />
              <CardContent style={{ fontSize: "1.5em" }}>
                <span style={{ marginRight: ".25em", fontWeight: 700 }}>{numeral(this.props.summary.closed_count).format("0,0")}</span>
                <span style={{ color: "#878787" }}>({_.round((this.props.summary.closed_count / this.props.summary.created_count) * 100, 2)}%)</span>
              </CardContent>
            </Card>
            <Card style={{ margin: "1em" }}>
              <CardHeader title="Tickets reopened" />
              <CardContent style={{ fontSize: "1.5em" }}>
                <span style={{ marginRight: ".25em", fontWeight: 700 }}>{numeral(this.props.summary.reopened_count).format("0,0")}</span>
                <span style={{ color: "#878787" }}>({_.round((this.props.summary.reopened_count / this.props.summary.created_count) * 100, 2)}%)</span>
              </CardContent>
            </Card>
          </div>
        ) : null}
        {Helpers.slas[this.props.type] > 0 && this.state.fetchedData ? (
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            <Card style={{ margin: "1em", backgroundColor: "#f5f5f5" }}>
              <CardHeader title="Service Level Agreement" />
              <CardContent style={{ fontSize: "1.5em", fontWeight: 700 }}>{Helpers.slas[this.props.type]} days</CardContent>
            </Card>
            <Card style={{ margin: "1em", backgroundColor: "#f5f5f5" }}>
              <CardHeader title="Tickets closed within SLA" />
              <CardContent style={{ fontSize: "1.5em" }}>
                <span style={{ marginRight: ".25em", fontWeight: 700 }}>{numeral(_.sumBy(this.state.data, "closed_within_sla")).format("0,0")}</span>
                <span style={{ color: "#878787" }}>
                  ({_.round((_.sumBy(this.state.data, "closed_within_sla") / this.props.summary.closed_count) * 100, 1)}%)
                </span>
              </CardContent>
            </Card>
          </div>
        ) : null}
        {this.state.fetchedData ? <IssueChart data={this.state.data} /> : null}
      </div>
    );
  }
}

export default IssueSummary;
