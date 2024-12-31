// src/services/audio.ts
export class AudioService {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: AudioWorkletNode | null = null;
  private isProcessing: boolean = false;

  async initialize() {
    if (this.audioContext) return;

    try {
      this.audioContext = new AudioContext({
        sampleRate: 16000,
        latencyHint: 'interactive'
      });
      
      // Update this line with the correct path
      await this.audioContext.audioWorklet.addModule('/audio-processor.worklet.js');
    } catch (error) {
      console.error('Failed to initialize AudioService:', error);
      throw error;
    }
  }
  
    async startRecording(onAudioData: (data: ArrayBuffer) => void) {
      if (this.isProcessing) return;
      if (!this.audioContext) await this.initialize();
  
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
  
        const source = this.audioContext!.createMediaStreamSource(this.mediaStream);
        this.processor = new AudioWorkletNode(this.audioContext!, 'audio-processor');
  
        this.processor.port.onmessage = (event) => {
          onAudioData(event.data);
        };
  
        source.connect(this.processor);
        this.processor.connect(this.audioContext!.destination);
        this.isProcessing = true;
  
      } catch (error) {
        console.error('Failed to start recording:', error);
        this.stopRecording();
        throw error;
      }
    }
  
    stopRecording() {
      try {
        this.isProcessing = false;
        this.mediaStream?.getTracks().forEach(track => track.stop());
        this.processor?.disconnect();
        this.audioContext?.close();
        
        this.mediaStream = null;
        this.processor = null;
        this.audioContext = null;
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  
    async checkPermissions(): Promise<boolean> {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        console.error('Microphone permission denied:', error);
        return false;
      }
    }
  }