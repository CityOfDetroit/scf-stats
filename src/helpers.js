import _ from 'lodash';

const Helpers = {
    /** Issue types and their Service Level Agreements for number of days to close */
    slas: {
    "Abandoned Vehicles": 5,
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
    "Traffic Signal Issue": 2,
    "Tree Issue": 14,
    "Water Main Break": 4,
    "Other - Not within City jurisdiction": null,
    "Other - Not within scope of City services": null,
    "Other - Referred to other City Department": null,
  },

    /**
   * Get unique values for a specific key and sum their occurances
   * @param {array} data - 311 tickets json
   * @param {string} key - object key in tickets json to group by
   * @returns {array} - array of objects like { name: '', value: 0 }
   */
  groupData: function(data, key) {
    return _.chain(data)
      .groupBy(d => d[key])
      .map((v, k) => ({ name: k, value: v.length }))
      .value();
  }
};

export default Helpers;
