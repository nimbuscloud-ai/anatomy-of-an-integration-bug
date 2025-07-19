const { sequelize } = require('../shared/db');
const FaresService = require('./fares.service');
const EventQueue = require('../shared/event-queue');

describe('FaresService', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  
  beforeEach(async () => {
    await sequelize.truncate({ cascade: true, force: true });
    EventQueue.clear();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should create fare and publish event', async () => {
    const fare = await FaresService.createFare(25.50, 'A');
    
    expect(fare.fare_amount).toBe(25.50);
    expect(fare.id).toBeDefined();

    const events = EventQueue.consume();
    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('TripCompleted');
    expect(events[0].payload.fareId).toBe(fare.id);
    expect(events[0].payload.driverTier).toBe('A');
  });
});