import React, { useEffect, useRef, useState } from 'react'

interface VoiceVisualizerProps {
  isActive: boolean
  audioStream?: MediaStream
  className?: string
}

export function VoiceVisualizer({ isActive, audioStream, className = '' }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const analyserRef = useRef<AnalyserNode>()
  const audioContextRef = useRef<AudioContext>()
  const [currentTime, setCurrentTime] = useState('00:00,00')
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isActive && audioStream) {
      // Initialize Web Audio API
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      const source = audioContextRef.current.createMediaStreamSource(audioStream)
      source.connect(analyserRef.current)

      // Start time tracking
      startTimeRef.current = Date.now()
      
      // Start visualization
      visualize()
      
      // Update timer
      const timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const minutes = Math.floor(elapsed / 60000)
        const seconds = Math.floor((elapsed % 60000) / 1000)
        const centiseconds = Math.floor((elapsed % 1000) / 10)
        setCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${centiseconds.toString().padStart(2, '0')}`)
      }, 10)

      return () => {
        clearInterval(timerInterval)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close()
        }
      }
    } else {
      // Stop animation when not active
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setCurrentTime('00:00,00')
    }
  }, [isActive, audioStream])

  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext('2d')!
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      analyserRef.current!.getByteFrequencyData(dataArray)

      // Clear canvas
      canvasCtx.fillStyle = 'rgb(17, 24, 39)' // bg-black
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw waveform
      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8

        // Red color like in the screenshot
        canvasCtx.fillStyle = `rgb(239, 68, 68)` // text-red-500
        canvasCtx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight)

        x += barWidth + 1
      }

      // Draw center line when active
      if (isActive) {
        canvasCtx.strokeStyle = 'rgb(239, 68, 68)'
        canvasCtx.lineWidth = 2
        canvasCtx.beginPath()
        canvasCtx.moveTo(canvas.width / 2, 0)
        canvasCtx.lineTo(canvas.width / 2, canvas.height)
        canvasCtx.stroke()
      }
    }

    draw()
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-white text-sm mb-1">
        {isActive ? 'Listening...' : 'Click microphone to start'}
      </div>
      
      <div className="relative w-full max-w-4xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-48 bg-black rounded-md"
        />
        
        {/* Timeline */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900">
          <div 
            className="h-full bg-red-500 transition-all duration-100"
            style={{ width: isActive ? '50%' : '0%' }}
          />
        </div>
      </div>
      
      {/* Timer */}
      <div className="text-white text-4xl font-mono mt-1">
        {currentTime}
      </div>
      
      {/* Status text */}
      <div className="text-gray-400 text-sm mt-2">
        {isActive ? 'Recording... Press space or click mic to stop' : 'Press space or click mic to start'}
      </div>
    </div>
  )
}