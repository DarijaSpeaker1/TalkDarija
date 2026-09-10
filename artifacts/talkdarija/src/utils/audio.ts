export type SoundName =
  | "correct"
  | "incorrect"
  | "click"
  | "heart-lost"
  | "heart-gained"
  | "xp"
  | "achievement"
  | "lesson-complete"
  | "unlock"
  | "streak";

let audioContext: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext ??= new AudioContextClass();
    if (audioContext.state === "suspended")
      void audioContext.resume().catch(() => undefined);
    return audioContext;
  } catch {
    return null;
  }
}

const tones: Record<
  SoundName,
  { notes: number[]; duration: number; type: OscillatorType }
> = {
  correct: { notes: [523, 659], duration: 0.11, type: "sine" },
  incorrect: { notes: [180, 130], duration: 0.13, type: "triangle" },
  click: { notes: [320], duration: 0.045, type: "sine" },
  "heart-lost": { notes: [250, 190], duration: 0.12, type: "triangle" },
  "heart-gained": { notes: [440, 554], duration: 0.1, type: "sine" },
  xp: { notes: [392, 523, 659], duration: 0.08, type: "sine" },
  achievement: { notes: [392, 523, 659, 784], duration: 0.09, type: "sine" },
  "lesson-complete": {
    notes: [330, 440, 554, 659],
    duration: 0.12,
    type: "sine",
  },
  unlock: { notes: [294, 392, 494], duration: 0.12, type: "sine" },
  streak: { notes: [440, 554, 698], duration: 0.1, type: "sine" },
};

export function playSound(name: SoundName, enabled = true) {
  if (!enabled) return;
  const context = getContext();
  if (!context) return;
  try {
    const tone = tones[name];
    const output = context.createGain();
    output.gain.setValueAtTime(0.0001, context.currentTime);
    output.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.01);
    output.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + tone.duration * tone.notes.length + 0.06,
    );
    output.connect(context.destination);
    tone.notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = tone.type;
      oscillator.frequency.value = frequency;
      oscillator.connect(output);
      oscillator.start(context.currentTime + index * tone.duration * 0.72);
      oscillator.stop(
        context.currentTime + index * tone.duration * 0.72 + tone.duration,
      );
    });
  } catch {
    // Sound effects are optional. A blocked or unavailable audio context
    // should never interrupt a lesson.
  }
}
