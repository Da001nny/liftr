/**
 * liftr: Audio & Haptic Notification Engine for Rest Timer
 * 
 * Generates an authoritative chime alert using the Web Audio API (zero external asset dependency).
 * Triggers device vibration via navigator.vibrate with graceful fallback on unsupported environments.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    console.warn('[soundAlert] Web Audio not accessible:', err);
    return null;
  }
}

/**
 * Plays a double chime completion alert for rest timer expiry.
 */
export function playTimerCompletionSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Chime 1 (High bell: 880 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Chime 2 (Brighter harmonic: 1320 Hz - E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.18);
    gain2.gain.setValueAtTime(0, now + 0.18);
    gain2.gain.linearRampToValueAtTime(0.40, now + 0.20);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.warn('[soundAlert] Failed playing chime:', err);
  }
}

/**
 * Triggers haptic vibration alert with graceful fallback where unsupported.
 */
export function triggerHapticAlert(): void {
  if (typeof window === 'undefined') return;
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      // Distinct double buzz: 200ms on, 100ms off, 200ms on
      navigator.vibrate([200, 100, 200]);
    }
  } catch (err) {
    // Vibration fails gracefully where unsupported or blocked
  }
}

/**
 * Combined alert: sound + vibration
 */
export function playRestTimerAlert(): void {
  playTimerCompletionSound();
  triggerHapticAlert();
}
