#!/usr/bin/env node

const { sequelize } = require('./services/shared/db');
const FaresService = require('./services/rider-fares-service/fares.service');
const AnalyticsService = require('./services/analytics-service/analytics.service');
const PayoutsService = require('./services/payouts-service/payouts.service');
const EventQueue = require('./services/shared/event-queue');

async function demo() {
  try {
    console.log('🚗 Break It Yourself Demo');
    console.log('=========================\n');
    
    // Initialize
    await sequelize.sync({ force: true });
    EventQueue.clear();
    
    // Create some sample fares
    console.log('📊 Creating sample fares...');
    const fare1 = await FaresService.createFare(15.50, 'A');
    const fare2 = await FaresService.createFare(22.75, 'B');
    const fare3 = await FaresService.createFare(8.25, 'A');
    
    console.log(`✅ Created fare #${fare1.id}: $${fare1.fare_amount} (Driver Tier A)`);
    console.log(`✅ Created fare #${fare2.id}: $${fare2.fare_amount} (Driver Tier B)`);
    console.log(`✅ Created fare #${fare3.id}: $${fare3.fare_amount} (Driver Tier A)`);
    
    // Analytics calculation
    console.log('\n📈 Analytics Service calculating total fares...');
    const totalFares = await AnalyticsService.calculateTotalFares();
    console.log(`💰 Total fares: $${totalFares}`);
    
    // Payouts calculation  
    console.log('\n💸 Payouts Service calculating driver bonuses...');
    const payouts = PayoutsService.calculatePayouts();
    console.log(`🎉 Total driver bonuses: $${payouts}`);
    console.log('   (Tier A drivers get $10 bonus, Tier B get $5 bonus)');
    
    console.log('\n🎯 All services working correctly!');
    console.log('\nTo see the bugs:');
    console.log('  git checkout feature/ai-db-refactor && npm run setup && npm test');
    console.log('  git checkout feature/ai-event-refactor && npm run setup && npm test');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  demo();
}

module.exports = demo;