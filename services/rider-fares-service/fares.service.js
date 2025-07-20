const { Fare } = require('../shared/db');
const EventQueue = require('../shared/event-queue');

class FaresService {
  static async createFare(amount, driverTier) {
    // Store as fixed-precision string for better precision (AI improvement)
    const fare = await Fare.create({
      fare_amount: amount.toFixed(2)
    });

    EventQueue.publish('TripCompleted', {
      fareId: fare.id,
      driverTier: driverTier
    });

    return fare;
  }

  static async getAllFares() {
    return await Fare.findAll();
  }
}

module.exports = FaresService;