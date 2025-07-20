#!/usr/bin/env python3
import sqlite3
import os
from pathlib import Path

class AnalyticsService:
    def __init__(self):
        # Path to the shared SQLite database - use environment variable or default
        db_path_env = os.environ.get('DB_PATH')
        if db_path_env:
            self.db_path = db_path_env
        else:
            db_path = Path(__file__).parent.parent.parent / "db" / "development.sqlite"
            self.db_path = str(db_path)
    
    def calculate_total_fares(self):
        """Calculate total fares by reading directly from the database replica."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Read all fares from the database
            cursor.execute("SELECT fare_amount FROM fares")
            fares = cursor.fetchall()
            
            # Calculate total - this will break if fare_amount is stored as text strings
            total = None

            for fare_row in fares:
                fare_amount = fare_row[0]
                if total is None:
                    total = fare_amount
                else:
                    total += fare_amount
            
            conn.close()
            return total
            
        except Exception as e:
            print(f"Error calculating fares: {e}")
            raise

if __name__ == "__main__":
    service = AnalyticsService()
    total = service.calculate_total_fares()
    print(f"Total fares: ${total}")