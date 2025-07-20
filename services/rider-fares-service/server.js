#!/usr/bin/env node

const { sequelize } = require('../shared/db');
const FaresService = require('./fares.service');

async function startServer() {
  console.log('🚗 Rider-Fares-Service starting...');
  
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Create sample fares every 5 seconds to show the system working
    let fareId = 1;
    const driverTiers = ['A', 'B'];
    const fareAmounts = [15.50, 22.75, 8.25, 31.20, 12.90];
    
    setInterval(async () => {
      try {
        const tier = driverTiers[Math.floor(Math.random() * driverTiers.length)];
        const amount = fareAmounts[Math.floor(Math.random() * fareAmounts.length)];
        
        const fare = await FaresService.createFare(amount, tier);
        console.log(`💰 Created fare #${fare.id}: $${fare.fare_amount} (Driver Tier ${tier})`);
        fareId++;
      } catch (error) {
        console.error('❌ Error creating fare:', error.message);
      }
    }, 3000);
    
    console.log('🎯 Rider-Fares-Service running - creating fares every 3 seconds');
    
  } catch (error) {
    console.error('❌ Failed to start Rider-Fares-Service:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Rider-Fares-Service...');
  await sequelize.close();
  process.exit(0);
});

startServer();