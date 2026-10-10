import { useEffect, useRef } from 'react'

interface ServiceHeroBackgroundProps {
  videoSrc?: string
}

/**
 * Background video layer for service hero banners with atmospheric dark gradients and vignettes.
 */
export default function ServiceHeroBackground({ videoSrc }: ServiceHeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.defaultMuted = true
    video.muted = true
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy handled gracefully
      })
    }
  }, [videoSrc])

  if (!videoSrc) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        key={videoSrc}
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover object-center motion-reduce:hidden opacity-70"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      {/* Base wash for high-contrast text readability */}
      <div className="absolute inset-0 bg-cyber-bg/45 backdrop-blur-[0.5px]" />
      {/* Radial vignette focused behind title and badge */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_40%,rgba(18,18,18,0.25)_0%,rgba(18,18,18,0.85)_100%)]" />
      {/* Top and bottom linear gradient fades */}
      <div className="absolute inset-0 bg-linear-to-b from-cyber-bg/80 via-transparent to-cyber-bg" />
    </div>
  )
}
