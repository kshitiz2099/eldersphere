export class VoiceServiceTest {
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private recording = false;

  async testStreamingAudio() {
    this.audioContext = new AudioContext();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const source = this.audioContext.createMediaStreamSource(this.stream);
    const destination = this.audioContext.destination;
    
    // Connect input directly to output (echo back)
    source.connect(destination);
    
    this.recording = true;
    console.log('🎤 Speaking back your audio in real-time');
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.audioContext?.close();
    this.audioContext = null;
    this.recording = false;
    console.log('🛑 Stopped audio test');
  }
}
