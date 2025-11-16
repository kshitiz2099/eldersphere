const API_BASE_URL = 'http://localhost:8000';

export interface UserNameResponse {
  user_id: number;
  name: string;
  success: boolean;
}

export interface UserGroupsResponse {
  user_id: number;
  groups: any[];
  success: boolean;
}

export interface GroupChatsResponse {
  group_id: number;
  chats: any[];
  success: boolean;
}

export async function getUserName(userId: number): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/name`);
  const data: UserNameResponse = await response.json();
  return data.name;
}

export async function getUserGroups(userId: number): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/groups`);
  const data: UserGroupsResponse = await response.json();
//   console.log("Groups Data:", data.groups);
  return data.groups;
}

export async function getGroupChats(groupId: number): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/group/${groupId}/chats`);
  const data: GroupChatsResponse = await response.json();
  console.log("Group Chats Data:", data.chats[0]);
  return data.chats[0];
}

export async function addMessageToGroup(groupId: number, message: {
  id: number;
  sender: number;
  senderName: string;
  text: string;
  timestamp: string;
}): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/group/${groupId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  const data = await response.json();
  return data.success;
}
