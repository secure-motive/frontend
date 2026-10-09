const ID_PATTERN = /^[\w-]{11}$/

/** Extracts the video id from a YouTube link (watch, youtu.be, embed, shorts, live, or raw id). */
export function getYouTubeId(link: string): string | undefined {
  if (!link) return undefined
  const trimmed = link.trim()
  if (ID_PATTERN.test(trimmed)) {
    return trimmed
  }

  let url: URL
  try {
    url = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`)
  } catch {
    return undefined
  }

  const { hostname, pathname, searchParams } = url
  const host = hostname.replace(/^www\./, '').toLowerCase()

  let id: string | null | undefined
  if (host === 'youtu.be') {
    id = pathname.split('/').filter(Boolean)[0]
  } else if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtube-nocookie.com' ||
    host === 'music.youtube.com'
  ) {
    const parts = pathname.split('/').filter(Boolean)
    if (parts[0] === 'watch') {
      id = searchParams.get('v')
    } else if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live' || parts[0] === 'v') {
      id = parts[1]
    } else {
      id = searchParams.get('v')
    }
  }

  return id && ID_PATTERN.test(id) ? id : undefined
}

/** YouTube's own still for a video, or undefined when the link is not a YouTube video. */
export function getYouTubeThumbnail(link: string): string | undefined {
  const id = getYouTubeId(link)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined
}

/**
 * Returns an embed URL using the privacy-enhanced youtube-nocookie.com domain.
 * Configured with modestbranding and playsinline for smooth in-page playback.
 */
export function getYouTubeEmbedUrl(link: string, autoplay = true): string | undefined {
  const id = getYouTubeId(link)
  if (!id) return undefined
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
  })
  if (autoplay) {
    params.set('autoplay', '1')
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

