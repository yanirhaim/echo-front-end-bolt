// src/services/api.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  status: string;
  data?: T;
  error?: string;
}

interface CreateRoomResponse {
  status: string;
  room_code: string;
  created_at: string;
}

interface JoinRoomResponse {
  status: string;
  room_code: string;
  host_id: string;
  participant_count: number;
}

// Keep track of in-flight requests
const pendingRequests = new Map<string, Promise<any>>();

export const api = {
  checkHealth: async () => {
    try {
      const response = await axios.get<ApiResponse<{ status: string }>>(`${BASE_URL}/api/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  leaveRoom: async (userId: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/rooms/leave/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Room leaving failed:', error);
      throw error;
    }
  },

  closeRoom: async (roomCode: string, userId: string) => {
    try {
      const response = await axios.post<ApiResponse<{ message: string }>>(`${BASE_URL}/api/rooms/close/${roomCode}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Room closure failed:', error);
      throw error;
    }
  },

  createRoom: async (userId: string, name: string) => {
    const requestKey = `createRoom-${userId}`;
    
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    const request = axios.post<CreateRoomResponse>(
      `${BASE_URL}/api/rooms/create/${userId}`,
      null,
      { params: { name } }
    )
      .then(response => response.data)
      .catch(error => {
        console.error('Room creation failed:', error);
        throw error;
      })
      .finally(() => {
        pendingRequests.delete(requestKey);
      });

    pendingRequests.set(requestKey, request);
    return request;
  },

  // Update in api.ts
  joinRoom: async (roomCode: string, userId: string, name: string) => {
    const requestKey = `joinRoom-${roomCode}-${userId}`;
    
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    const request = axios.post<JoinRoomResponse>(
      `${BASE_URL}/api/rooms/join/${roomCode}/${userId}`,
      null,
      { params: { name } }
    )
      .then(response => response.data)
      .catch(error => {
        console.error('Room joining failed:', error);
        throw error;
      })
      .finally(() => {
        pendingRequests.delete(requestKey);
      });

    pendingRequests.set(requestKey, request);
    return request;
  }
};