/* Optional generative sound: a deep hum for the descent, a ping for the sonar.
   Strictly opt-in. No audio assets — everything is synthesised. */

import { useSyncExternalStore } from "react";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
const listeners = new Set<() => void>();

function ensureGraph(): void {
  if (ctx) return;
  const AC: typeof AudioContext | undefined =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // deep hum — two slightly detuned sines
  const humGain = ctx.createGain();
  humGain.gain.value = 0.05;
  humGain.connect(master);
  for (const f of [46, 46.55]) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.connect(humGain);
    o.start();
  }

  // abyssal noise — brown noise through a slowly breathing low-pass
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 130;
  lp.Q.value = 0.4;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.16;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 55;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();

  noise.connect(lp);
  lp.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();
}

export function setSoundEnabled(v: boolean): void {
  if (enabled === v) return;
  enabled = v;
  if (v) {
    ensureGraph();
    if (ctx && master) {
      void ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.85, ctx.currentTime, 0.9);
    }
  } else if (ctx && master) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
  }
  listeners.forEach((l) => l());
}

export function playPing(): void {
  if (!enabled || !ctx || !master) return;
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1180, t);
  osc.frequency.exponentialRampToValueAtTime(340, t + 0.5);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.14, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

  // echo
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.27;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const wet = ctx.createGain();
  wet.gain.value = 0.45;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  osc.connect(g);
  g.connect(master);
  g.connect(delay);

  osc.start(t);
  osc.stop(t + 0.95);
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useSound(): [boolean, (v: boolean) => void] {
  const value = useSyncExternalStore(subscribe, () => enabled);
  return [value, setSoundEnabled];
}
