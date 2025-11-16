from repository.mongo_repository import MongoRepository
from typing import List, Dict, Any

mongo_repo = MongoRepository()

def get_user_name_by_id(user_id: int) -> str:
    user = mongo_repo.get_user(user_id)
    if user:
        return user.get('name', '')
    return ''

def get_user_groups(user_id: int) -> List[Dict[str, Any]]:
    """Get all groups that a user belongs to."""
    user = mongo_repo.get_user(user_id)
    if not user:
        return []
    
    group_ids = user.get('groups', [])
    groups = []
    for group_id in group_ids:
        group = mongo_repo.get_group(group_id)
        if group:
            groups.append(group)
    
    return groups

def get_group_chats_with_names(group_id: int) -> List[Dict[str, Any]]:
    """Get all chats for a group."""
    chats = mongo_repo.get_group_chat_messages(group_id)
    # print(f"Fetched {len(chats)} chats for group ID {group_id}")
    return chats

def add_message_to_group(group_id: int, message: Dict[str, Any]) -> bool:
    """Add a new message to a group's chat."""
    return mongo_repo.append_message_to_group(group_id, message)
