import React, { Component } from 'react';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

class IssuePicker extends Component {
  render() {
    return (
      <FormControl style={{ marginRight: '2em' }}>
        <Select
          value={this.props.default}
          onChange={this.props.onChange}
          style={{ minWidth: 300 }}>
          <MenuItem value="*">All Issue Types</MenuItem>
          {this.props.issues.map(i => (
            <MenuItem key={i.request_type_title} value={i.request_type_title}>{i.request_type_title}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default IssuePicker;
