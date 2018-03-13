import React, { Component } from 'react';
import { Select } from 'antd';
const Option = Select.Option;

class IssuePicker extends Component {
  render() {
    return (
      <div>
        <Select
          defaultValue="*"
          onChange={this.props.onChange}
          size="large"
          style={{ width: 400, margin: '1em' }}>
          <Option value="*">All Issues Types</Option>
          {this.props.issues.map(i => (
            <Option key={i.request_type_title} value={i.request_type_title}>{i.request_type_title}</Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default IssuePicker;
