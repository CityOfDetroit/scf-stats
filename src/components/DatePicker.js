import React, { Component } from 'react';
import moment from 'moment';
import { DateRangePicker, isInclusivelyAfterDay } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

class DatePicker extends Component {
  render() {
    return (
      <DateRangePicker
        startDateId="startDate"
        startDate={this.props.start}
        endDateId="endDate"
        endDate={this.props.end}
        onDatesChange={this.props.onDatesChange}
        focusedInput={this.props.focus}
        onFocusChange={this.props.onFocusChange} 
        isOutsideRange={day => isInclusivelyAfterDay(day, moment().add(0, 'day'))}
        minimumNights={1}
        showClearDates={false}
        block={false}
        small={true}
        noBorder={true}
      />
    );
  }
}

export default DatePicker;
