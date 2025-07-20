#!/usr/bin/env python3

import time
import sys
import os
from pathlib import Path
from analytics_service import AnalyticsService

def start_server():
    print('📊 Analytics-Service (Python) starting...')
    
    try:
        # Test database connection
        service = AnalyticsService()
        print('✅ Database connection established')
        
        # Calculate total fares every 10 seconds
        while True:
            try:
                total = service.calculate_total_fares()
                print(f"📈 Total fares calculated: ${(total or 0):.2f}")
                time.sleep(10)
                
            except KeyboardInterrupt:
                print('\n🛑 Shutting down Analytics-Service...')
                break
            except Exception as e:
                print(f'❌ Error calculating fares: {e}')
                time.sleep(10)
                
    except Exception as e:
        print(f'❌ Failed to start Analytics-Service: {e}')
        sys.exit(1)

if __name__ == '__main__':
    start_server()