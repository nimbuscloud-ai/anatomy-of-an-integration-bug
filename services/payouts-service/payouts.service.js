const EventQueue = require('../shared/event-queue');

class PayoutsService {
  static calculatePayouts() {
    const events = EventQueue.consume();
    const tripCompletedEvents = events.filter(event => event.eventName === 'TripCompleted');
    
    let totalPayouts = 0;
    
    tripCompletedEvents.forEach(event => {
      const { driverTier } = event.payload;
      
      if (driverTier === 'A') {
        totalPayouts += 10; // 10% bonus for tier A drivers
      } else if (driverTier === 'B') {
        totalPayouts += 5;  // 5% bonus for tier B drivers
      }
    });
    
    return totalPayouts;
  }
}

module.exports = PayoutsService;