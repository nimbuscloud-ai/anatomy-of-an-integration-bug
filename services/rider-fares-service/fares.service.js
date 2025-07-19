const { Fare } = require('../shared/db');
const EventQueue = require('../shared/event-queue');

class FaresService {
  static async createFare(amount, driverTier) {
    const fare = await Fare.create({
      fare_amount: amount
    });

    EventQueue.publish('TripCompleted', {
      fareId: fare.id
    });

    return fare;
  }

  static async getAllFares() {
    return await Fare.findAll();
  }
}

module.exports = FaresService;