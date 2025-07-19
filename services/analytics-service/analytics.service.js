const { Fare } = require('../shared/db');

class AnalyticsService {
  static async calculateTotalFares() {
    const fares = await Fare.findAll();
    
    return fares.reduce((total, fare) => {
      return total + fare.fare_amount;
    }, 0);
  }
}

module.exports = AnalyticsService;