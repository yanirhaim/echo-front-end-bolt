// src/services/websocket.ts
import type { WebSocketMessage } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isClosing = false;

  constructor(
    private userId: string,
    private onMessage: (data: WebSocketMessage) => void,
    private onError: (error: any) => void,
    private onStatusChange: (status: 'connected' | 'disconnected' | 'reconnecting') => void
  ) {}

  connect() {
    try {
      // Reset closing flag when starting a new connection
      this.isClosing = false;
      const wsUrl = `ws://localhost:8000/ws/${this.userId}`;
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      this.onError(error);
      this.handleReconnection();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onStatusChange('connected');
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = typeof event.data === 'string' 
          ? JSON.parse(event.data) 
          : event.data;
        this.onMessage(data);
      } catch (error) {
        console.error('Error parsing message:', error);
        this.onError(error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      // Only attempt reconnection if this wasn't a deliberate close
      if (!this.isClosing) {
        this.onStatusChange('disconnected');
        this.handleReconnection();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.onError(error);
    };
  }

  sendLanguagePreference(language: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.isClosing) {
      console.warn('Cannot send language preference: WebSocket is not connected');
      return;
    }

    this.send({
      type: 'language_preference' as const,
      language,
      timestamp: new Date().toISOString()
    });
  }

  sendAudioData(audioData: ArrayBuffer) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.isClosing) {
      console.warn('Cannot send audio data: WebSocket is not connected');
      return;
    }

    try {
      this.ws.send(audioData);
    } catch (error) {
      console.error('Error sending audio data:', error);
      this.onError(error);
    }
  }

  private send(data: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.isClosing) {
      console.warn('Cannot send message: WebSocket is not connected');
      return;
    }

    try {
      this.ws.send(JSON.stringify(data));
    } catch (error) {
      console.error('Error sending message:', error);
      this.onError(error);
    }
  }

  private handleReconnection() {
    if (this.isClosing) {
      return; // Don't reconnect if we're deliberately closing
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.onStatusChange('reconnecting');
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.reconnectTimeout = setTimeout(() => {
        if (!this.isClosing) {
          console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          this.connect();
        }
      }, 1000 * Math.min(this.reconnectAttempts * 2, 10));
    } else {
      console.log('Max reconnection attempts reached');
      this.onStatusChange('disconnected');
    }
  }

  disconnect() {
    this.isClosing = true;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      // Only try to close if the connection is still open
      if (this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.close(1000, 'Client disconnecting');
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        }
      }
      this.ws = null;
    }

    this.onStatusChange('disconnected');
  }
}