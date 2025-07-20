#!/usr/bin/env python3
import pytest
import sqlite3
import tempfile
import os
from pathlib import Path

from analytics_service import AnalyticsService

class TestAnalyticsService:
    
    @pytest.fixture(autouse=True)
    def setup_test_database(self):
        """Set up a temporary test database for each test."""
        # Create a temporary database file for testing
        self.test_db = tempfile.NamedTemporaryFile(delete=False, suffix='.sqlite')
        self.test_db_path = self.test_db.name
        self.test_db.close()
        
        # Create the fares table
        conn = sqlite3.connect(self.test_db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE fares (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fare_amount REAL NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()
        
        # Override the DB_PATH environment variable for this test
        os.environ['DB_PATH'] = self.test_db_path
        
        yield
        
        # Clean up
        os.unlink(self.test_db_path)
        if 'DB_PATH' in os.environ:
            del os.environ['DB_PATH']
        
    def _insert_test_fare(self, amount):
        """Helper to insert test fare data directly into the database."""
        conn = sqlite3.connect(self.test_db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO fares (fare_amount, createdAt, updatedAt) VALUES (?, datetime('now'), datetime('now'))",
            (amount,)
        )
        fare_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return fare_id
    
    def test_calculate_total_fares_correctly(self):
        """Test that analytics service calculates total fares correctly."""
        self._insert_test_fare(10.50)
        self._insert_test_fare(20.25)
        
        service = AnalyticsService()
        total = service.calculate_total_fares()
        
        assert total == 30.75, f"Expected 30.75, got {total}"