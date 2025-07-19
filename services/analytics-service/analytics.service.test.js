const { sequelize } = require('../shared/db');
const FaresService = require('../rider-fares-service/fares.service');
const AnalyticsService = require('./analytics.service');
const EventQueue = require('../shared/event-queue');

describe('AnalyticsService', () => {
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

  test('should calculate total fares correctly', async () => {
    await FaresService.createFare(10.50, 'A');
    await FaresService.createFare(20.25, 'B');
    
    const total = await AnalyticsService.calculateTotalFares();
    
    expect(total).toBe(30.75);
  });
});