/* Cinematic programmatic scrolling — used for gauge jumps and the resurface. */

export function scrollToY(target: number, duration = 1500): void {
  const start = window.scrollY;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const clampedTarget = Math.max(0, Math.min(target, max));
  const delta = clampedTarget - start;
  if (Math.abs(delta) < 2) return;

  const t0 = performance.now();
  let alive = true;

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const cancel = () => {
    alive = false;
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
  };
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });

  const step = (now: number) => {
    if (!alive) return;
    const t = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + delta * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
    else {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    }
  };
  requestAnimationFrame(step);
}

export function scrollToSection(id: string, duration = 1500): void {
  const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(y, duration);
}
