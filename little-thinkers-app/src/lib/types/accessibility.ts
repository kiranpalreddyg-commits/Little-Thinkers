export type GameplayMode = 'smart' | 'chill' | 'focus'

export type TextSize = 'small' | 'medium' | 'large'

export type HandedLayout = 'default' | 'left' | 'right'

export interface AccessibilitySettings {
  gameplayMode: GameplayMode
  reducedMotion: boolean
  colorBlindMode: boolean
  dyslexiaFont: boolean
  textSize: TextSize
  handedLayout: HandedLayout
  feedbackDuration: number
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  gameplayMode: 'smart',
  reducedMotion: false,
  colorBlindMode: false,
  dyslexiaFont: false,
  textSize: 'medium',
  handedLayout: 'default',
  feedbackDuration: 2000,
}
