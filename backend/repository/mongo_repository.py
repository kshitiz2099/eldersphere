from pymongo import MongoClient
from datetime import datetime
from typing import Optional, Dict, Any, List
import os
from dotenv import load_dotenv

load_dotenv()

class MongoRepository:
    def __init__(self, connection_string: str = None):
        if connection_string is None:
            connection_string = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.client = MongoClient(connection_string)
        self.db = self.client["eldersphere"]
        self.collection = self.db["test_records"]
        
        self.users = self.db['users']
        self.groups = self.db['groups']
        self.group_chats = self.db['group_chats']
    
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
    
    # ========== USERS ==========
    
    def add_user(self, user_data: Dict[str, Any]) -> str:
        """Add a new user to the database."""
        result = self.users.insert_one(user_data)
        return str(result.inserted_id)
    
    def modify_user(self, user_id: int, updates: Dict[str, Any]):
        """
        Modify user attributes. 
        For list fields, appends to existing lists.
        For other fields, replaces the value.
        """
        current_user = self.users.find_one({"_id": user_id})
        
        modified_updates = {}
        for key, value in updates.items():
            if isinstance(value, list) and key in current_user and isinstance(current_user[key], list):
                modified_updates[key] = {"$each": value}
            else:
                modified_updates[key] = value
        
        push_updates = {k: v for k, v in modified_updates.items() if isinstance(v, dict)}
        set_updates = {k: v for k, v in modified_updates.items() if not isinstance(v, dict)}
        
        update_query = {}
        if push_updates:
            update_query["$push"] = {k: v for k, v in push_updates.items()}
        if set_updates:
            update_query["$set"] = set_updates
        
        self.users.update_one({"_id": user_id}, update_query)
    
    def get_user(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get a user by ID."""
        return self.users.find_one({"_id": user_id})
    
    def get_all_users(self) -> List[Dict[str, Any]]:
        """Get all users."""
        return list(self.users.find())
    
    def load_users_from_json(self, json_file_path: str):
        """Load initial users from JSON file if collection is empty."""
        if self.users.count_documents({}) > 0:
            return
        
        import json
        with open(json_file_path, 'r') as f:
            users_data = json.load(f)
        
        for idx, user in enumerate(users_data):
            user['_id'] = idx
            self.users.insert_one(user)
    
    # ========== GROUPS ==========
    
    def create_group(self, group_data: Dict[str, Any]) -> str:
        """Create a new group."""
        result = self.groups.insert_one(group_data)
        return str(result.inserted_id)
    
    def add_member_to_group(self, group_id: int, member_id: int):
        """Add a member to a group."""
        self.groups.update_one(
            {"_id": group_id},
            {"$addToSet": {"members": member_id}}
        )
    
    def remove_member_from_group(self, group_id: int, member_id: int):
        """Remove a member from a group."""
        self.groups.update_one(
            {"_id": group_id},
            {"$pull": {"members": member_id}}
        )
    
    def get_group(self, group_id: int) -> Optional[Dict[str, Any]]:
        """Get a group by ID."""
        return self.groups.find_one({"_id": group_id})
    
    def get_all_groups(self) -> List[Dict[str, Any]]:
        """Get all groups."""
        return list(self.groups.find())
    
    def load_groups_from_json(self, json_file_path: str):
        """Load initial groups from JSON file if collection is empty."""
        if self.groups.count_documents({}) > 0:
            return
        
        import json
        with open(json_file_path, 'r') as f:
            groups_data = json.load(f)
        
        for idx, group in enumerate(groups_data):
            group['_id'] = idx
            self.groups.insert_one(group)
    
    # ========== GROUP CHATS ==========
    
    def add_group_chat_message(self, message_data: Dict[str, Any]) -> str:
        """Add a message to group chats."""
        result = self.group_chats.insert_one(message_data)
        return str(result.inserted_id)
    
    def get_group_chat_messages(self, group_id: int) -> List[Dict[str, Any]]:
        """Get all messages for a specific group."""
        return list(self.group_chats.find({"group_id": group_id}).sort("timestamp", 1))
    
    def get_group_chat_by_id(self, chat_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific group chat message by its ID."""
        from bson import ObjectId
        return self.group_chats.find_one({"_id": ObjectId(chat_id)})
    
    def get_all_group_chats(self) -> List[Dict[str, Any]]:
        """Get all group chat messages."""
        return list(self.group_chats.find())
    
    def load_group_chats_from_json(self, json_file_path: str):
        """Load initial group chats from JSON file if collection is empty."""
        if self.group_chats.count_documents({}) > 0:
            return
        
        import json
        with open(json_file_path, 'r') as f:
            chats_data = json.load(f)
        
        self.group_chats.insert_many(chats_data)
    
    def initialize_from_files(self, users_file: str = None, groups_file: str = None, chats_file: str = None):
        """Initialize all collections from JSON files if they are empty."""
        if users_file:
            self.load_users_from_json(users_file)
        if groups_file:
            self.load_groups_from_json(groups_file)
        if chats_file:
            self.load_group_chats_from_json(chats_file)
