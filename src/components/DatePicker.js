import React, { Component } from 'react';
import { Select } from 'antd';
const Option = Select.Option;

class DatePicker extends Component {
  render() {
    return (
      <div>
        <Select
          defaultValue={this.props.weeks.toString()}
          onChange={this.props.onChange}
          size="large"
          style={{ width: 150, margin: '1em' }}>
          <Option value="1">Last week</Option>
          <Option value="3">Last 3 weeks</Option>
          <Option value="6">Last 6 weeks</Option>
        </Select>
      </div>
    );
  }
}

export default DatePicker;
