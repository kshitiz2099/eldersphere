from pymongo import MongoClient
from datetime import datetime
from typing import Optional, Dict, Any

class MongoRepository:
    def __init__(self, connection_string: str = "mongodb://localhost:27017/"):
        self.client = MongoClient(connection_string)
        self.db = self.client["eldersphere"]
        self.collection = self.db["test_records"]
    
    # def write_personality(self, data: Dict[str, Any]) -> Optional[str]:

    def write_test_record(self, data: Dict[str, Any]) -> Optional[str]:
        """
        Write a test record to MongoDB
        
        Args:
            data: Dictionary containing the data to write
            
        Returns:
            The ID of the inserted document as a string, or None if failed
        """
        try:
            record = {
                **data,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = self.collection.insert_one(record)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error writing to MongoDB: {e}")
            return None
    
    def get_test_record(self, record_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a test record by ID
        
        Args:
            record_id: The ID of the record to retrieve
            
        Returns:
            The record as a dictionary, or None if not found
        """
        try:
            from bson import ObjectId
            record = self.collection.find_one({"_id": ObjectId(record_id)})
            if record:
                record["_id"] = str(record["_id"])
            return record
        except Exception as e:
            print(f"Error reading from MongoDB: {e}")
            return None
    
    def get_all_test_records(self) -> list:
        """
        Retrieve all test records
        
        Returns:
            List of all records
        """
        try:
            records = list(self.collection.find())
            for record in records:
                record["_id"] = str(record["_id"])
            return records
        except Exception as e:
            print(f"Error reading from MongoDB: {e}")
            return []
    
    def close(self):
        """Close the MongoDB connection"""
        self.client.close()
