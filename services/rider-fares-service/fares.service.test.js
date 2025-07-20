const { sequelize } = require('../shared/db');
const FaresService = require('./fares.service');
const EventQueue = require('../shared/event-queue');
const fs = require('fs');

describe('FaresService', () => {
  const TEST_EVENTS_FILE = '/tmp/test_fares_events.jsonl';
  const originalEventsFile = EventQueue.EVENTS_FILE;
  
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  
  beforeEach(async () => {
    await sequelize.truncate({ cascade: true, force: true });
    EventQueue.EVENTS_FILE = TEST_EVENTS_FILE;
    if (fs.existsSync(TEST_EVENTS_FILE)) {
      fs.unlinkSync(TEST_EVENTS_FILE);
    }

    fs.writeFileSync(TEST_EVENTS_FILE, '');
  });

  afterAll(async () => {
    EventQueue.EVENTS_FILE = originalEventsFile;
    if (fs.existsSync(TEST_EVENTS_FILE)) {
      fs.unlinkSync(TEST_EVENTS_FILE);
    }
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