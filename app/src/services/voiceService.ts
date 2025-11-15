import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export class VoiceService {
  private elevenlabs: ElevenLabsClient;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private silenceTimeout: any = null;
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying = false;

  constructor(apiKey: string) {
    this.elevenlabs = new ElevenLabsClient({ apiKey });
  }

  async connectToWebSocket(url: string = 'ws://localhost:8000') {
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };
      
      this.ws.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          const arrayBuffer = await event.data.arrayBuffer();
          this.audioQueue.push(arrayBuffer);
          if (!this.isPlaying) {
            this.playAudioQueue();
          }
        } else {
          console.log('Message from server:', event.data);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    });
  }


  async startRecording(onTranscript: (text: string) => void) {
    await this.connectToWebSocket();
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);
    
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
      
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        this.ws.send(arrayBuffer);
      }
      
      this.audioChunks = [];
      this.mediaRecorder?.start();
    };

    this.mediaRecorder.start();
    this.detectSilence();
  }

  private detectSilence() {
    if (!this.analyser) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkAudio = () => {
      if (!this.analyser || !this.mediaRecorder) return;
      
      this.analyser.getByteTimeDomainData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
      }
      const rms = Math.sqrt(sum / bufferLength);
      
      if (rms < 0.01) {
        if (!this.silenceTimeout) {
          this.silenceTimeout = setTimeout(() => {
            if (this.mediaRecorder?.state === 'recording') {
              this.mediaRecorder.stop();
            }
            this.silenceTimeout = null;
          }, 1500);
        }
      } else {
        if (this.silenceTimeout) {
          clearTimeout(this.silenceTimeout);
          this.silenceTimeout = null;
        }
      }
      
      requestAnimationFrame(checkAudio);
    };
    
    checkAudio();
  }

  stopRecording() {
    this.mediaRecorder?.stop();
    this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
  }

  private async playAudioQueue() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }
    
    this.isPlaying = true;
    const audioData = this.audioQueue.shift()!;
    
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    source.onended = () => {
      this.playAudioQueue();
    };
    
    source.start();
  }
}
