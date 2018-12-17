import _ from 'lodash';

const Helpers = {
    /** Issue types and their Service Level Agreements for number of days to close */
    slas: {
    "Abandoned Vehicle": 7,
    "Blocked Catch Basin": 15,
    "Cemetery Issue": 5,
    "Curbside Solid Waste Issue": 10,
    "DPW - Debris Removal - DPW USE ONLY": null,
    "DPW - Other environmental - DPW USE ONLY": null,
    "Dead Animal Removal": 3,
    "Fire Hydrant Issue": 15,
    "Illegal Dump Sites": 10,
    "Illegal Dumping In Progress": 7,
    "Manhole Cover Issue": 5,
    "New LED Street Light Out": 7,
    "Park Issue": 5,
    "Potholes": 5,
    "Residential Snow Removal Issue": 1,
    "Rodent Extermination - BSEED Only": null,
    "Running Water in a Home or Building": 4,
    "Squatters Issue": 7,
    "Squatters - Fraud Investigation": 45,
    "Street Light Out": 7,
    "Street Light Pole Down": 5,
    "Street Light / Street Light Pole Major Repair": 30,
    "Traffic Sign Issue": 7,
    "Traffic Signal Issue": 3,
    "Tree Issue": 14,
    "Water Main Break": 4,
    "Other - Not within City jurisdiction": null,
    "Other - Not within scope of City services": null,
    "Other - Referred to other City Department": null,
  },

   /**
   * Get unique values for a specific key and sum their occurances for making charts
   * @param {array} data - 311 tickets json
   * @param {string} key - object key in tickets json to group by
   * @returns {array} - array of objects like { name: '', value: 0 }
   */
  groupData: function(data, key) {
    return _.chain(data)
      .groupBy(d => d[key])
      .map((v, k) => ({ name: k, value: v.length }))
      .value();
  },

  /**
   * Iterate through issues and check if days to close is within their SLA
   * @param {array} data - 311 ticket json
   * @param {string} type - request type title, matches text in slas
   * @returns {array} - 311 ticket json with new property "closed_within_sla" if ticket is closed
   */
  checkSla: function(data, type) {
    data.map(d => {
      let sla = this.slas[type];
      if (d.days_to_close < sla) {
        d.closed_within_sla = 1;
      }

      return d;
    });

    return data;
  },

  addSla: function(data) {
    data.map(d => {
      let sla = this.slas[d.request_type_title];
      d.sla = sla;

      // add a new key/value pair to data where 1 is closed within sla, 0 is not
      if (d.days_to_close < sla) {
        d.closed_within_sla = 1;
      } else {
        d.closed_within_sla = 0
      }

      return d;
    });

    return _.chain(data)
      .groupBy(d => d['request_type_title'])
      .map((v, k) => ({ type: k, closed_within_sla: _.sumBy(v, 'closed_within_sla'), sla: 'dummy' }))
      .value();
  }
};

export default Helpers;
