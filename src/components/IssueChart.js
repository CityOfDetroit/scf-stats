import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import _ from 'lodash';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import moment from 'moment';

class IssueChart extends Component {
  render() {
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
        title: {
          text: 'Tickets'
        }
      },
      series: [{
        data: Object.values(_.countBy(this.props.data, 'council_district'))
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
      colors: ['#3f51b5']
    };

    let createdDays = _.groupBy(this.props.data, function(d) {
      return moment(d['created_at']).format('MM-DD-YYYY');
    });

    let res = _.map(createdDays, function(group, day) {
      return {
        day: day,
        opened: group.length
      }
    });

    res = _.sortBy(res, 'day');

    let byDateConfig = {
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      yAxis: {
        min: 0,
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
          return this.y + ' tickets opened on ' + this.x
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      colors: ['#f50057']
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
