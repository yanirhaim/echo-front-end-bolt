// src/contexts/MeetingContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketService } from '../services/websocket';
import { AudioService } from '../services/audio';
import { api } from '../services/api';
import { generateUserId } from '../services/user';
import type { Participant, WebSocketMessage, Transcript } from '../types';

interface MeetingContextType {
  isHost: boolean;
  roomCode: string | null;
  participants: Participant[];
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  transcripts: Transcript[];
  isCreatingRoom: boolean;
  isMuted: boolean;
  createRoom: (name: string) => Promise<string>;
  joinRoom: (name: string, code: string) => Promise<void>;
  leaveRoom: () => void;
  closeRoom: () => Promise<void>;
  setLanguagePreference: (language: string) => void;
  initializeAudio: () => Promise<void>;
  toggleMute: () => void;
  userId: string;
}

const MeetingContext = createContext<MeetingContextType | null>(null);

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const wsRef = useRef<WebSocketService | null>(null);
  const audioRef = useRef<AudioService | null>(null);
  const userId = useRef<string>(generateUserId());
  const userName = useRef<string>("");

  const cleanupServices = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.stopRecording();
      audioRef.current = null;
    }
    // Reset all relevant states
    setIsCreatingRoom(false);
    setIsMuted(true);
  }, []);

  const leaveRoom = useCallback(async () => {
    if (!roomCode) return;

    try {
      // Call the leave room API
      await api.leaveRoom(userId.current);
    } catch (error) {
      console.error('Failed to leave room:', error);
    } finally {
      // Clean up regardless of API call success
      cleanupServices();
      setRoomCode(null);
      setIsHost(false);
      setTranscripts([]);
      setParticipants([]);
      setConnectionStatus('disconnected');
    }
  }, [roomCode, cleanupServices]);

  const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
    try {
      switch (data.type) {
        case 'partial':
          // Skip partial transcripts to only show final results
          break;

          case 'participant_update':
            if (data.action === 'join') {
              setParticipants(prev => [...prev, data.participant]);
            } else if (data.action === 'leave') {
              setParticipants(prev => prev.filter(p => p.id !== data.participant.id));
            }
            break;

        case 'final':
          setTranscripts(prev => [...prev, {
            text: data.text,
            isFinal: true,
            timestamp: data.timestamp,
            confidence: data.confidence
          }]);
          break;

        case 'translation':
          setTranscripts(prev => {
            const lastIndex = prev.length - 1;
            if (lastIndex >= 0) {
              const updated = [...prev];
              updated[lastIndex] = {
                ...updated[lastIndex],
                translation: data.text
              };
              return updated;
            }
            return prev;
          });
          break;

        case 'host_status':
          if (data.status === 'disconnected') {
            setParticipants(prev => 
              prev.map(p => p.isHost ? { ...p, status: 'inactive' } : p)
            );
            
            if (!isHost) {
              console.warn('Host has disconnected from the meeting');
            }
          } else if (data.status === 'connected') {
            setParticipants(prev => 
              prev.map(p => p.isHost ? { ...p, status: 'active' } : p)
            );
          }
          break;

          case 'room_closed':
            // Only show alert and handle redirect for non-host participants
            if (!isHost) {
              alert('The host has ended the meeting');
              // Clean up
              cleanupServices();
              setRoomCode(null);
              setIsHost(false);
              setTranscripts([]);
              setParticipants([]);
              setConnectionStatus('disconnected');
              // Force redirection to main page
              window.location.href = '/';  // Or use your navigation method
            }
            break;
  

        case 'error':
          console.error('WebSocket error received:', data.text);
          break;

        default:
          console.warn('Unknown message type received:', data);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }, [isHost, leaveRoom, cleanupServices]);

  const initializeWebSocket = useCallback(() => {
    if (wsRef.current) return;

    wsRef.current = new WebSocketService(
      userId.current,
      handleWebSocketMessage,
      (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      },
      setConnectionStatus
    );
    wsRef.current.connect();
  }, [handleWebSocketMessage]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.startRecording((audioData) => {
        wsRef.current?.sendAudioData(audioData);
      });
    } else {
      audioRef.current.stopRecording();
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  const initializeAudio = useCallback(async () => {
    if (audioRef.current) return;

    try {
      audioRef.current = new AudioService();
      await audioRef.current.initialize();
      
      if (isHost) {
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw new Error('Failed to initialize audio system');
    }
  }, [isHost]);

  const createRoom = useCallback(async (name: string): Promise<string> => {
  if (isCreatingRoom) {
    return '';
  }

  try {
    setIsCreatingRoom(true);
    userName.current = name;
    
    // Ensure cleanup before creating new room
    cleanupServices();
    
    // Pass both userId and name to createRoom
    const response = await api.createRoom(userId.current, name);
    setRoomCode(response.room_code);
    setIsHost(true);
    
    await initializeWebSocket();

    // Initialize participants with the list from the response
    setParticipants(response.participants || [{
      id: userId.current,
      name: name,
      status: 'active',
      joinedAt: new Date(),
      isHost: true,
      isMuted: false
    }]);

    return response.room_code;
  } catch (error) {
    cleanupServices();
    console.error('Failed to create room:', error);
    throw error;
  } finally {
    setIsCreatingRoom(false);
  }
}, [initializeWebSocket, cleanupServices, isCreatingRoom]);

const joinRoom = useCallback(async (name: string, code: string): Promise<void> => {
  try {
    userName.current = name;
    const response = await api.joinRoom(code, userId.current, name);
    setRoomCode(code);
    setIsHost(false);

    await initializeWebSocket();

    // Initialize participants with the complete list from the response
    setParticipants(response.participants || []);

  } catch (error) {
    cleanupServices();
    console.error('Failed to join room:', error);
    throw error;
  }
}, [initializeWebSocket, cleanupServices]);

  const closeRoom = useCallback(async () => {
    if (!roomCode || !isHost) return;

    try {
      if (window.confirm('Are you sure you want to end the meeting for all participants?')) {
        // Close the room on the server
        await api.closeRoom(roomCode, userId.current);
        
        // Leave the room
        await api.leaveRoom(userId.current);

        // Clean up locally without showing alert (since host initiated the close)
        cleanupServices();
        setRoomCode(null);
        setIsHost(false);
        setTranscripts([]);
        setParticipants([]);
        setConnectionStatus('disconnected');

        // Redirect host
        window.location.href = '/';  // Or use your navigation method
      }
    } catch (error) {
      console.error('Failed to close/leave room:', error);
      throw error;
    }
  }, [roomCode, isHost, cleanupServices]);

  const setLanguagePreference = useCallback((language: string) => {
    if (!wsRef.current) {
      throw new Error('WebSocket connection not established');
    }
    try {
      wsRef.current.sendLanguagePreference(language);
    } catch (error) {
      console.error('Failed to set language preference:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupServices();
    };
  }, [cleanupServices]);

  const value: MeetingContextType = {
    isHost,
    roomCode,
    participants,
    connectionStatus,
    transcripts,
    isCreatingRoom,
    isMuted,
    userId: userId.current,
    createRoom,
    joinRoom,
    leaveRoom,
    closeRoom,
    setLanguagePreference,
    initializeAudio,
    toggleMute
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
};

export default MeetingProvider;