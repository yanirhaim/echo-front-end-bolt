// src/types/index.ts
export interface Participant {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  joinedAt: Date;
  isHost?: boolean;
  isMuted?: boolean;
  language?: string;
}

export interface MeetingState {
  isStarted: boolean;
  code: string | null;
  participants: Participant[];
}

export interface Transcript {
  text: string;
  translation?: string;
  isFinal: boolean;
  timestamp: string;
  confidence?: number;
}

export type MessageType = 'partial' | 'final' | 'translation' | 'host_status' | 'error' | 'room_closed' | 'participant_update';;

export interface RoomClosedMessage extends BaseWebSocketMessage {
  type: 'room_closed';
}

export interface BaseWebSocketMessage {
  type: MessageType;
  timestamp: string;
}

export interface PartialTranscriptMessage extends BaseWebSocketMessage {
  type: 'partial';
  text: string;
  is_final: false;
}

export interface FinalTranscriptMessage extends BaseWebSocketMessage {
  type: 'final';
  text: string;
  confidence: number;
}

export interface TranslationMessage extends BaseWebSocketMessage {
  type: 'translation';
  text: string;
  original_text: string;
  language: string;
}

export interface HostStatusMessage extends BaseWebSocketMessage {
  type: 'host_status';
  status: 'connected' | 'disconnected';
}

export interface ErrorMessage extends BaseWebSocketMessage {
  type: 'error';
  text: string;
}

export interface ParticipantUpdateMessage extends BaseWebSocketMessage {
  type: 'participant_update';
  action: 'join' | 'leave';
  participant: Participant;
}

export type WebSocketMessage = 
  | PartialTranscriptMessage 
  | FinalTranscriptMessage 
  | TranslationMessage 
  | HostStatusMessage 
  | ErrorMessage
  | RoomClosedMessage
  | ParticipantUpdateMessage;

export interface AudioStatus {
  isRecording: boolean;
  isMuted: boolean;
  hasPermission: boolean;
  error?: string;
}