import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import _ from 'lodash';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import moment from 'moment';

class IssueChart extends Component {
  render() {
     // use map instead of Object.values()
    let summaryData = _.countBy(this.props.data, 'council_district')
    let byDistrictValues = Object.keys(summaryData).map(function(key) {
      return summaryData[key];
    });

    // bar chart by council district config
    let byPlaceConfig = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: Object.keys(_.countBy(this.props.data, 'council_district')),
        crosshair: true,
        title: {
          text: 'Council District'
        }
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: 'Tickets'
        }
      },
      series: [{
        data: byDistrictValues
      }],
      tooltip: {
        formatter: function() {
          return this.y + ' tickets opened in District ' + this.x
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      colors: ['#9FD5B3']
    };

    let createdDays = _.groupBy(this.props.data, function(d) {
      return moment(d['created_at']).format('MM/DD/YY');
    });

    let res = _.map(createdDays, function(group, day) {
      return {
        day: day,
        opened: group.length
      }
    });

    res = _.sortBy(res, 'day');

    // line chart by date opened config
    let byDateConfig = {
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: 'Tickets'
        }
      },
      xAxis: {
        categories: _.map(res, 'day')
      },
      series: [{
        name: 'Opened',
        data: _.map(res, 'opened')
      }],
      tooltip: {
        formatter: function() {
          return this.y + ' tickets opened on ' + moment(this.x).format('dddd MM/DD/YYYY')
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      colors: ['#279989']
    };

    return (
      <div>
        <Card style={{ margin: '1em' }} >
          <CardHeader title="Tickets by date opened" />
          <CardContent>
            <ReactHighcharts config={byDateConfig}></ReactHighcharts>
          </CardContent>
        </Card>
        <Card style={{ margin: '1em' }} >
          <CardHeader title="Tickets by Council District" />
          <CardContent>
            <ReactHighcharts config={byPlaceConfig}></ReactHighcharts>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default IssueChart;
