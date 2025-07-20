#!/usr/bin/env node

const PayoutsService = require('./payouts.service');

async function startServer() {
  console.log('💸 Payouts-Service starting...');
  
  try {
    console.log('✅ Payouts-Service initialized');
    
    // Calculate payouts every 15 seconds
    setInterval(() => {
      try {
        const totalPayouts = PayoutsService.calculatePayouts();
        console.log(`🎉 Driver bonuses calculated: $${totalPayouts}`);
        
        if (totalPayouts === 0) {
          console.log('⚠️  No events found for payout calculation');
        }
      } catch (error) {
        console.error('❌ Error calculating payouts:', error.message);
      }
    }, 15000);
    
    console.log('🎯 Payouts-Service running - calculating bonuses every 15 seconds');
    
  } catch (error) {
    console.error('❌ Failed to start Payouts-Service:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Payouts-Service...');
  process.exit(0);
});

startServer();