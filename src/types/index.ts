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
  ttsStatus?: 'loading' | 'ready' | 'playing' | 'error';
}

export type MessageType = 
  | 'partial' 
  | 'final' 
  | 'translation' 
  | 'host_status' 
  | 'error' 
  | 'room_closed' 
  | 'participant_update'
  | 'tts_status';

export interface RoomClosedMessage extends BaseWebSocketMessage {
  type: 'room_closed';
  message: string;
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
  source_language: string;
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

export interface TTSStatusMessage extends BaseWebSocketMessage {
  type: 'tts_status';
  status: 'loading' | 'ready' | 'playing' | 'error';
  transcriptId: string;
}

export type WebSocketMessage = 
  | PartialTranscriptMessage 
  | FinalTranscriptMessage 
  | TranslationMessage 
  | HostStatusMessage 
  | ErrorMessage
  | RoomClosedMessage
  | ParticipantUpdateMessage
  | TTSStatusMessage;

export interface AudioStatus {
  isRecording: boolean;
  isMuted: boolean;
  hasPermission: boolean;
  error?: string;
}

export interface TTSOptions {
  volume: number;
  speed: number;
  voice?: string;
  autoPlay?: boolean;
  language?: string;
}

export interface AudioControlsState {
  volume: number;
  speed: number;
  isMuted: boolean;
  voice?: string;
  autoPlay: boolean;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  error?: string;
}

export interface CreateRoomResponse {
  status: string;
  room_code: string;
  created_at: string;
  participants: Participant[];
}

export interface JoinRoomResponse {
  status: string;
  room_code: string;
  host_id: string;
  participant_count: number;
  participants: Participant[];
}

export interface RoomSettings {
  maxParticipants: number;
  allowTranslation: boolean;
  allowRecording: boolean;
  defaultLanguage: string;
  autoTranslate: boolean;
}

export interface TTSPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  transcriptId: string | null;
  error?: string;
}

export interface ConnectionState {
  status: 'connected' | 'disconnected' | 'reconnecting';
  lastConnected?: Date;
  error?: string;
  retryCount: number;
}

export interface TranscriptionSettings {
  language: string;
  autoTranslate: boolean;
  targetLanguage?: string;
  enableInterimResults: boolean;
  punctuation: boolean;
}