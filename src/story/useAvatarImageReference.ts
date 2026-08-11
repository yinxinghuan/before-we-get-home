import { useMemo } from 'react'

export interface AvatarImageReference {
  ready: boolean
  refUrl?: string
  prepared: boolean
}

function publicHttpsUrl(value: string): string | undefined {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : undefined
  } catch {
    return undefined
  }
}

/**
 * The Media Service owns the output canvas. The player's original avatar is
 * identity evidence only, so preserve its pixels and aspect ratio instead of
 * cropping it into the 4:5 scene composition.
 */
export function useAvatarImageReference(
  sourceRefUrl: string | undefined,
  profileReady: boolean,
  _width: number,
  _height: number,
): AvatarImageReference {
  const sourceUrl = useMemo(
    () => sourceRefUrl ? publicHttpsUrl(sourceRefUrl) : undefined,
    [sourceRefUrl],
  )
  return {
    ready: profileReady,
    ...(profileReady && sourceUrl ? { refUrl: sourceUrl } : {}),
    prepared: false,
  }
}
