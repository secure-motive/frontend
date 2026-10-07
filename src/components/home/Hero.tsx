import { useEffect, useRef } from 'react'
import { heroIntro, heroMedia } from '@/data/home'
import FrameworkCoverage from './FrameworkCoverage'

// Interpolated in sRGB, like the design; Tailwind's default (oklab) gives peach mid-tones instead of olive.
const GRADIENT_LINE =
  'block bg-linear-to-r/srgb from-cyber-teal via-cyber-orange to-cyber-teal bg-clip-text text-transparent'

/** Still image, with the looping video playing over it. Both are decorative. */
function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.defaultMuted = true
    video.muted = true
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback until user interaction or low-power mode
      })
    }
  }, [])

  const mediaClasses = 'absolute inset-0 size-full object-cover object-center'

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <img
        src={heroMedia.image}
        alt=""
        width={heroMedia.width}
        height={heroMedia.height}
        fetchPriority="high"
        className={mediaClasses}
      />
      {heroMedia.video && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroMedia.image}
          className={`${mediaClasses} motion-reduce:hidden`}
        >
          <source src={heroMedia.video} type="video/mp4" />
        </video>
      )}
      {/* Base wash for atmospheric contrast */}
      <div className="absolute inset-0 bg-cyber-bg/55" />
      {/* Radial vignette focused behind headline and chips */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(18,18,18,0.65)_0%,rgba(18,18,18,0.2)_65%,transparent_100%)]" />
      {/* Seamless linear fades: top under navbar, bottom into the next section */}
      <div className="absolute inset-0 bg-linear-to-b from-cyber-bg/70 via-transparent to-cyber-bg" />
    </div>
  )
}

/** Home hero: darkened vehicle backdrop, 128px headline, intro and framework chips. */
export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      <HeroBackground />
      <div className="relative flex w-full max-w-5xl flex-col items-center gap-5 px-6 pt-16 pb-20 text-center md:pt-20 md:pb-30">
        {/* The heading shrinks to its widest line and each coloured line fills
            it, so both gradients span "SECURING THE" — as in the design. */}
        <h1 className="font-display text-5xl font-bold tracking-tight text-white uppercase sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="block">Securing the</span>
          <span className={GRADIENT_LINE}>Connected</span>
          <span className={GRADIENT_LINE}>Vehicle</span>
        </h1>
        <p className="max-w-2xl pt-1 text-lg leading-relaxed text-white/85 sm:text-xl">
          {heroIntro}
        </p>
        <FrameworkCoverage />
      </div>
    </section>
  )
}
