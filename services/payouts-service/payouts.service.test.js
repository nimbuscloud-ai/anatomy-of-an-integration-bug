const { sequelize } = require('../shared/db');
const FaresService = require('../rider-fares-service/fares.service');
const PayoutsService = require('./payouts.service');
const EventQueue = require('../shared/event-queue');

describe('PayoutsService', () => {
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

  test('should calculate payouts correctly for tier A drivers', async () => {
    await FaresService.createFare(25.50, 'A');
    await FaresService.createFare(15.25, 'A');
    
    const payouts = PayoutsService.calculatePayouts();
    
    expect(payouts).toBe(20); // Two tier A drivers = 10 + 10
  });

  test('should calculate payouts correctly for tier B drivers', async () => {
    await FaresService.createFare(25.50, 'B');
    
    const payouts = PayoutsService.calculatePayouts();
    
    expect(payouts).toBe(5); // One tier B driver = 5
  });

  test('should calculate payouts correctly for mixed tiers', async () => {
    await FaresService.createFare(25.50, 'A');
    await FaresService.createFare(15.25, 'B');
    
    const payouts = PayoutsService.calculatePayouts();
    
    expect(payouts).toBe(15); // One A (10) + one B (5) = 15
  });
});