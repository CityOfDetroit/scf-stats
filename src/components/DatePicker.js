import React, { Component } from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';

class DatePicker extends Component {
  render() {
    return (
      <FormControl component="fieldset">
        <RadioGroup
          name="timeframe"
          value={this.props.weeks.toString()}
          onChange={this.props.onChange}
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <FormControlLabel value="1" control={<Radio />} label="Last week" />
          <FormControlLabel value="3" control={<Radio />} label="Last 3 weeks" />
          <FormControlLabel value="6" control={<Radio />} label="Last 6 weeks" />
        </RadioGroup>
      </FormControl>
    );
  }
}

export default DatePicker;
