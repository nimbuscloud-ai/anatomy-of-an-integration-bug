const PayoutsService = require('./payouts.service');
const EventQueue = require('../shared/event-queue');
const fs = require('fs');

describe('PayoutsService', () => {
  const TEST_EVENTS_FILE = '/tmp/test_payouts_events.jsonl';
  let originalEventsFile;
  
  beforeAll(() => {
    originalEventsFile = EventQueue.EVENTS_FILE;
  });
  
  beforeEach(() => {
    EventQueue.EVENTS_FILE = TEST_EVENTS_FILE;
    if (fs.existsSync(TEST_EVENTS_FILE)) {
      fs.unlinkSync(TEST_EVENTS_FILE);
      fs.writeFileSync(TEST_EVENTS_FILE, '');
    }
  });
  
  afterAll(() => {
    EventQueue.EVENTS_FILE = originalEventsFile;
    if (fs.existsSync(TEST_EVENTS_FILE)) {
      fs.unlinkSync(TEST_EVENTS_FILE);
    }
  });

  function createMockTripEvent(fareId, driverTier) {
    const event = {
      eventName: 'TripCompleted',
      payload: { fareId, driverTier },
      timestamp: new Date().toISOString()
    };
    
    fs.appendFileSync(TEST_EVENTS_FILE, JSON.stringify(event) + '\n', 'utf8');
  }

  test('should calculate payouts correctly for tier A drivers', () => {
    createMockTripEvent(1, 'A');
    createMockTripEvent(2, 'A');
    
    const payouts = PayoutsService.calculatePayouts();
    
    expect(payouts).toBe(20); // Two tier A drivers = 10 + 10
  });

  test('should calculate payouts correctly for tier B drivers', () => {
    createMockTripEvent(1, 'B');
    
    const payouts = PayoutsService.calculatePayouts();
    
    expect(payouts).toBe(5); // One tier B driver = 5
  });

  test('should calculate payouts correctly for mixed tiers', () => {
    createMockTripEvent(1, 'A');
    createMockTripEvent(2, 'B');

    const payouts = PayoutsService.calculatePayouts();
    
    expect(payouts).toBe(15); // One A (10) + one B (5) = 15
  });
});