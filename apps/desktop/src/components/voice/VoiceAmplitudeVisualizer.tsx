import React, { useEffect, useRef, useState } from 'react'

interface VoiceAmplitudeVisualizerProps {
  audioStream?: MediaStream
  size?: number
  color?: string
  className?: string
}

export function VoiceAmplitudeVisualizer({ 
  audioStream, 
  size = 48, 
  color = 'cyan',
  className = '' 
}: VoiceAmplitudeVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const analyserRef = useRef<AnalyserNode>()
  const audioContextRef = useRef<AudioContext>()
  const [amplitude, setAmplitude] = useState(0)

  useEffect(() => {
    if (!audioStream) return

    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 1024
    analyserRef.current.smoothingTimeConstant = 0.85

    const source = audioContextRef.current.createMediaStreamSource(audioStream)
    source.connect(analyserRef.current)

    // Start visualization
    const visualize = () => {
      if (!analyserRef.current || !canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw)
        
        // Get frequency data
        analyserRef.current!.getByteFrequencyData(dataArray)
        
        // Calculate RMS (Root Mean Square) for accurate volume representation
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i] * dataArray[i]
        }
        const rms = Math.sqrt(sum / bufferLength)
        const normalizedAmplitude = rms / 255
        
        // Smooth the amplitude changes
        setAmplitude(prev => prev * 0.7 + normalizedAmplitude * 0.3)
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Draw circular visualization
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const baseRadius = size * 0.3
        const maxPulse = size * 0.15
        
        // Calculate current radius based on amplitude
        const currentRadius = baseRadius + (normalizedAmplitude * maxPulse)
        
        // Create gradient for the circle
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius)
        gradient.addColorStop(0, `rgba(6, 182, 212, ${0.6 + normalizedAmplitude * 0.4})`) // cyan-500 with dynamic opacity
        gradient.addColorStop(0.7, `rgba(6, 182, 212, ${0.3 + normalizedAmplitude * 0.2})`)
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.1)')
        
        // Draw main circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Draw outer glow ring
        ctx.beginPath()
        ctx.arc(centerX, centerY, currentRadius + 5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 + normalizedAmplitude * 0.3})`
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Draw inner bright core
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 0.5)
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 + normalizedAmplitude * 0.2})`)
        coreGradient.addColorStop(1, `rgba(6, 182, 212, ${0.6 + normalizedAmplitude * 0.4})`)
        
        ctx.beginPath()
        ctx.arc(centerX, centerY, baseRadius * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = coreGradient
        ctx.fill()
      }

      draw()
    }

    visualize()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [audioStream, size])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full h-full"
        style={{ width: size, height: size }}
      />
      {/* Optional: Show amplitude value for debugging */}
      {/* <div className="absolute bottom-0 left-0 text-xs text-gray-400">
        {(amplitude * 100).toFixed(0)}%
      </div> */}
    </div>
  )
}