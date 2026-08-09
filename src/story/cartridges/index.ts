import { beforeWeGetHome, beforeWeGetHomeEn } from './beforeWeGetHome'
import type { Locale, StoryCartridge } from '../types'

export const DEFAULT_CARTRIDGE_ID = 'before-we-get-home'
export const CARTRIDGES: Record<string, StoryCartridge> = { 'before-we-get-home': beforeWeGetHome }
export const CARTRIDGES_EN: Record<string, StoryCartridge> = { 'before-we-get-home': beforeWeGetHomeEn }
export function listCartridges(locale: Locale): StoryCartridge[] { return [locale === 'en' ? beforeWeGetHomeEn : beforeWeGetHome] }
export function resolveCartridge(_id: string | null | undefined, locale: Locale = 'zh'): StoryCartridge { return locale === 'en' ? beforeWeGetHomeEn : beforeWeGetHome }
