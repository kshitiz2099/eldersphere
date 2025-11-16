"""
Latency testing script for voice chat pipeline.
Tests the improved streaming implementation and measures performance.
"""

import os
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

API_BASE = "http://localhost:8000"

def test_voice_chat_latency(audio_file_path: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM"):
    """
    Test voice chat endpoint and measure latency.
    
    Args:
        audio_file_path: Path to audio file to test
        voice_id: ElevenLabs voice ID
    """
    print(f"\n{'='*60}")
    print(f"🧪 Testing Voice Chat Latency")
    print(f"{'='*60}")
    print(f"Audio file: {audio_file_path}")
    print(f"Voice ID: {voice_id}")
    print(f"{'='*60}\n")
    
    if not os.path.exists(audio_file_path):
        print(f"❌ Error: Audio file not found: {audio_file_path}")
        return
    
    # Measure total time
    total_start = time.time()
    
    try:
        # Prepare request
        with open(audio_file_path, 'rb') as f:
            files = {'audio': (os.path.basename(audio_file_path), f, 'audio/webm')}
            
            print("📤 Sending audio to API...")
            request_start = time.time()
            
            response = requests.post(
                f"{API_BASE}/voice-chat-with-audio",
                files=files,
                params={'voice_id': voice_id}
            )
            
            request_time = (time.time() - request_start) * 1000
            
            if response.status_code != 200:
                print(f"❌ Error: {response.status_code}")
                print(response.text)
                return
            
            # Extract metrics from headers
            user_message = response.headers.get('X-User-Message', '')
            response_text = response.headers.get('X-Response-Text', '')
            stt_latency = response.headers.get('X-STT-Latency-Ms', 'N/A')
            llm_latency = response.headers.get('X-LLM-Latency-Ms', 'N/A')
            total_latency = response.headers.get('X-Total-Latency-Ms', 'N/A')
            
            # Decode URL-encoded text
            from urllib.parse import unquote
            user_message = unquote(user_message) if user_message else 'N/A'
            response_text = unquote(response_text) if response_text else 'N/A'
            
            total_time = (time.time() - total_start) * 1000
            
            # Get audio size
            audio_size = len(response.content)
            
            print(f"\n{'='*60}")
            print(f"✅ SUCCESS")
            print(f"{'='*60}")
            print(f"\n📝 TRANSCRIPT:")
            print(f"   You: {user_message}")
            print(f"   AI:  {response_text[:100]}...")
            print(f"\n⚡ LATENCY BREAKDOWN:")
            print(f"   Speech-to-Text:    {stt_latency} ms")
            print(f"   LLM Generation:    {llm_latency} ms")
            print(f"   Server Total:      {total_latency} ms")
            print(f"   Network + TTS:     {total_time - int(total_latency if total_latency != 'N/A' else 0):.0f} ms")
            print(f"   END-TO-END TOTAL:  {total_time:.0f} ms")
            print(f"\n📊 AUDIO RESPONSE:")
            print(f"   Size: {audio_size:,} bytes ({audio_size/1024:.1f} KB)")
            print(f"   Format: {response.headers.get('Content-Type', 'N/A')}")
            print(f"\n{'='*60}")
            
            # Save audio for verification
            output_file = "test_output.mp3"
            with open(output_file, 'wb') as f:
                f.write(response.content)
            print(f"💾 Audio saved to: {output_file}")
            print(f"{'='*60}\n")
            
            return {
                'stt_ms': int(stt_latency) if stt_latency != 'N/A' else None,
                'llm_ms': int(llm_latency) if llm_latency != 'N/A' else None,
                'total_ms': total_time,
                'audio_bytes': audio_size
            }
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return None


def record_test_audio(duration: int = 3):
    """
    Record test audio from microphone.
    
    Args:
        duration: Recording duration in seconds
    """
    try:
        import sounddevice as sd
        import soundfile as sf
        
        print(f"\n🎤 Recording {duration} seconds of audio...")
        print("Say something like: 'Hello, how are you today?'")
        print("3...")
        time.sleep(1)
        print("2...")
        time.sleep(1)
        print("1...")
        time.sleep(1)
        print("🔴 RECORDING NOW!")
        
        # Record
        fs = 44100  # Sample rate
        recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
        sd.wait()
        
        # Save
        output_file = "test_recording.wav"
        sf.write(output_file, recording, fs)
        
        print(f"✅ Recording saved to: {output_file}")
        return output_file
        
    except ImportError:
        print("❌ sounddevice and soundfile packages required for recording")
        print("Install with: pip install sounddevice soundfile")
        return None


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 ElderSphere Voice Chat - Latency Test")
    print("="*60)
    
    # Check if server is running
    try:
        health = requests.get(f"{API_BASE}/health", timeout=2)
        if health.status_code != 200:
            print("❌ API server not responding")
            exit(1)
        print("✅ API server is running")
    except:
        print("❌ Cannot connect to API server")
        print(f"Make sure the server is running on {API_BASE}")
        exit(1)
    
    print("\nOptions:")
    print("1. Test with existing audio file")
    print("2. Record new audio and test")
    print("3. Run benchmark (multiple tests)")
    
    choice = input("\nEnter choice (1/2/3): ").strip()
    
    if choice == "1":
        audio_file = input("Enter path to audio file: ").strip()
        test_voice_chat_latency(audio_file)
        
    elif choice == "2":
        duration = int(input("Recording duration in seconds (default 3): ") or "3")
        audio_file = record_test_audio(duration)
        if audio_file:
            test_voice_chat_latency(audio_file)
            
    elif choice == "3":
        print("\n📊 Running benchmark with multiple voices...")
        audio_file = input("Enter path to audio file: ").strip()
        
        voices = [
            ("21m00Tcm4TlvDq8ikWAM", "Rachel"),
            ("pNInz6obpgDQGcFmaJgB", "Adam"),
            ("ErXwobaYiN019PkySvjV", "Antoni"),
        ]
        
        results = []
        for voice_id, voice_name in voices:
            print(f"\n\nTesting with {voice_name}...")
            result = test_voice_chat_latency(audio_file, voice_id)
            if result:
                results.append((voice_name, result))
                time.sleep(1)  # Brief pause between tests
        
        # Summary
        print("\n" + "="*60)
        print("📊 BENCHMARK SUMMARY")
        print("="*60)
        for voice_name, result in results:
            print(f"\n{voice_name}:")
            print(f"  Total: {result['total_ms']:.0f}ms")
            print(f"  STT: {result['stt_ms']}ms | LLM: {result['llm_ms']}ms")
        print("="*60 + "\n")
    
    else:
        print("Invalid choice")
