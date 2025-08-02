import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../stores/appStore'
import { invoke } from '@tauri-apps/api/core'

export function WakeWordDetector() {
  const { settings, startVoiceSession, isVoiceActive } = useAppStore()
  const [isListening, setIsListening] = useState(false)
  const [detectionStatus, setDetectionStatus] = useState<'idle' | 'listening' | 'detected'>('idle')
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const bufferRef = useRef<Float32Array[]>([])
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    if (settings.voice_enabled && !isVoiceActive) {
      startListening()
    } else {
      stopListening()
    }
    
    return () => {
      stopListening()
    }
  }, [settings.voice_enabled, isVoiceActive])
  
  const startListening = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: settings.voice_settings.noise_suppression,
          autoGainControl: true,
        }
      })
      
      streamRef.current = stream
      
      // Create audio context
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
      microphoneRef.current.connect(analyserRef.current)
      
      setIsListening(true)
      setDetectionStatus('listening')
      
      // Start continuous detection
      detectWakeWord()
    } catch (error) {
      console.error('Failed to start wake word detection:', error)
      setDetectionStatus('idle')
    }
  }
  
  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current)
      detectionTimeoutRef.current = null
    }
    
    setIsListening(false)
    setDetectionStatus('idle')
    bufferRef.current = []
  }
  
  const detectWakeWord = () => {
    if (!analyserRef.current || !isListening) return
    
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    analyserRef.current.getFloatFrequencyData(dataArray)
    
    // Simple energy-based detection for now
    // In production, this would use a proper wake word detection model
    const energy = dataArray.reduce((sum, value) => sum + Math.abs(value), 0) / bufferLength
    
    // Store audio buffer for more sophisticated detection
    bufferRef.current.push(new Float32Array(dataArray))
    if (bufferRef.current.length > 50) { // Keep last ~1 second of audio
      bufferRef.current.shift()
    }
    
    // Simulate wake word detection (replace with real detection)
    // In a real implementation, we'd process the audio buffer with a model
    if (energy > -50 && Math.random() < 0.001) { // Very low random chance for demo
      handleWakeWordDetected()
    } else {
      // Continue detection
      requestAnimationFrame(detectWakeWord)
    }
  }
  
  const handleWakeWordDetected = async () => {
    setDetectionStatus('detected')
    
    // Visual/audio feedback
    playDetectionSound()
    
    // Stop wake word detection
    stopListening()
    
    // Start voice session
    await startVoiceSession({ mode: 'chain' })
    
    // Reset after a short delay
    setTimeout(() => {
      setDetectionStatus('idle')
    }, 2000)
  }
  
  const playDetectionSound = () => {
    // Create a simple beep sound
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 880 // A5 note
    gainNode.gain.value = 0.1
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1)
  }
  
  if (!settings.voice_enabled) {
    return null
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`
        flex items-center space-x-2 px-3 py-2 rounded-full
        ${detectionStatus === 'listening' ? 'bg-gray-900' : ''}
        ${detectionStatus === 'detected' ? 'bg-green-600' : ''}
        ${detectionStatus === 'idle' ? 'bg-gray-800' : ''}
        transition-all duration-300
      `}>
        <div className={`
          w-3 h-3 rounded-full
          ${detectionStatus === 'listening' ? 'bg-black animate-pulse' : ''}
          ${detectionStatus === 'detected' ? 'bg-green-400' : ''}
          ${detectionStatus === 'idle' ? 'bg-gray-500' : ''}
        `} />
        <span className="text-xs text-gray-300">
          {detectionStatus === 'listening' && `Say "${settings.voice_settings.wake_word}"`}
          {detectionStatus === 'detected' && 'Wake word detected!'}
          {detectionStatus === 'idle' && 'Wake word inactive'}
        </span>
      </div>
    </div>
  )
}