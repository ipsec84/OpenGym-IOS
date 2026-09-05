import { CHIME_B64 } from './chime-sound.js'

let audioCtx = null
let chimeAudio = null

// Unlock AudioContext and prepare HTML5 audio element on user interaction
// (Required by iOS/Safari to route audio through Bluetooth/AirPods and bypass silent switch)
export function unlockAudio() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) audioCtx = new AudioContextClass()
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    if (!chimeAudio && typeof Audio !== 'undefined') {
      chimeAudio = new Audio(CHIME_B64)
      chimeAudio.preload = 'auto'
    }
  } catch (e) {}
}

// Ensure audio is unlocked on first user touch anywhere in the app
if (typeof window !== 'undefined') {
  const onFirstInteraction = () => {
    unlockAudio()
    window.removeEventListener('touchstart', onFirstInteraction)
    window.removeEventListener('click', onFirstInteraction)
  }
  window.addEventListener('touchstart', onFirstInteraction, { passive: true })
  window.addEventListener('click', onFirstInteraction, { passive: true })
}

/**
 * Play a clear audio chime for timer completion.
 * Plays via both HTML5 Audio (which routes directly to Bluetooth headphones on iOS)
 * and WebAudio for redundancy.
 */
export function playChime(enabled = true) {
  if (!enabled) return
  unlockAudio()
  try {
    if (chimeAudio) {
      chimeAudio.currentTime = 0
      chimeAudio.play().catch(() => {})
    }
  } catch (e) {}

  // WebAudio upbeat 3-tone chime
  beep(enabled, 880, 0.12, 0)
  beep(enabled, 880, 0.12, 0.16)
  beep(enabled, 1320, 0.35, 0.32)
}

/**
 * Play countdown tick (3, 2, 1)
 */
export function playTick(enabled = true) {
  if (!enabled) return
  beep(enabled, 660, 0.08)
}

/**
 * Standard WebAudio beep
 */
export function beep(enabled, freq, dur, when) {
  if (!enabled) return
  try {
    unlockAudio()
    if (!audioCtx) return
    const o = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    o.connect(g)
    g.connect(audioCtx.destination)
    o.frequency.value = freq || 880
    o.type = 'sine'
    const t0 = audioCtx.currentTime + (when || 0)
    g.gain.setValueAtTime(0.001, t0)
    g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + (dur || 0.18))
    o.start(t0)
    o.stop(t0 + (dur || 0.18) + 0.05)
  } catch (e) {}
}

export function vibrate(pattern = [200, 100, 200]) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  } catch (e) {}
}
