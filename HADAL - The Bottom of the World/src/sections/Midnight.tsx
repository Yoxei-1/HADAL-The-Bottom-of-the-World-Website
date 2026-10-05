import { useEffect, useRef, useState } from "react";
import { Move, MousePointerClick, Hand, Pointer } from "lucide-react";
import { Section } from "../components/Section";
import { ZoneTag } from "../components/ZoneTag";
import { Lines } from "../components/TextStagger";
import { useEngine } from "../core/engine";
import { CREATURES } from "../data/zones";
import { playPing } from "../audio/engine";

type Ping = { id: number; x: number; y: number; t0: number };
let pingSeq = 0;

/**
 * III — MIDNIGHT. A pinned stage of pure dark. Your cursor is a light;
 * clicks send sonar pings that momentarily expose what lives down here.
 */
export function Midnight() {
  const { pointer, subscribe, fine, reduced } = useEngine();
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const creatureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lightPos = useRef({ x: 0, y: 0, init: false });
  const pingsRef = useRef<{ x: number; y: number; t0: number }[]>([]);
  const [pings, setPings] = useState<Ping[]>([]);

  const spawnPing = (e: React.PointerEvent) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const p: Ping = { id: ++pingSeq, x, y, t0: performance.now() };
    pingsRef.current.push({ x, y, t0: p.t0 });
    setPings((arr) => [...arr, p]);
    playPing();
    window.setTimeout(
      () => setPings((arr) => arr.filter((q) => q.id !== p.id)),
      1600
    );
  };

  useEffect(() => {
    return subscribe((dt, t) => {
      const stage = stageRef.current;
      const outer = outerRef.current;
      if (!stage || !outer) return;
      const r = stage.getBoundingClientRect();
      if (r.bottom < -120 || r.top > window.innerHeight + 120) return;

      /* section progress for creature parallax */
      const o = outer.getBoundingClientRect();
      const span = Math.max(1, o.height - window.innerHeight);
      const tSec = Math.max(0, Math.min(1, -o.top / span));

      /* the light: pointer, or a slow autonomous drift before first touch */
      let tx: number, ty: number;
      if (pointer.active.current) {
        tx = pointer.x.current - r.left;
        ty = pointer.y.current - r.top;
      } else if (reduced) {
        tx = r.width * 0.5;
        ty = r.height * 0.55;
      } else {
        tx = r.width * (0.5 + 0.3 * Math.sin(t * 0.22));
        ty = r.height * (0.52 + 0.26 * Math.cos(t * 0.17));
      }
      const lp = lightPos.current;
      if (!lp.init) {
        lp.x = tx;
        lp.y = ty;
        lp.init = true;
      }
      const k = 1 - Math.exp((-dt / 1000) * 5.2);
      lp.x += (tx - lp.x) * k;
      lp.y += (ty - lp.y) * k;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${lp.x}px, ${lp.y}px, 0) translate(-50%, -50%)`;
        lightRef.current.style.opacity = pointer.active.current ? "0.9" : "0.55";
      }

      /* purge spent pings */
      const now = performance.now();
      pingsRef.current = pingsRef.current.filter((p) => now - p.t0 < 1600);

      const reach = r.width * 0.13 + 240;

      CREATURES.forEach((c, i) => {
        const root = creatureRefs.current[i];
        const label = labelRefs.current[i];
        if (!root) return;

        const py = (tSec - 0.5) * -150 * c.speed;
        root.style.transform = `translate(-50%, -50%) translate3d(0, ${py.toFixed(1)}px, 0)`;

        const cx = (c.x / 100) * r.width;
        const cy = (c.y / 100) * r.height + py;
        const d = Math.hypot(lp.x - cx, lp.y - cy);

        let intensity = Math.max(0, 1.12 - d / reach);
        intensity = intensity * intensity;
        if (!reduced) intensity *= 0.88 + 0.12 * Math.sin(t * 2.6 + i * 2.1);

        let boost = 0;
        for (const p of pingsRef.current) {
          const age = (now - p.t0) / 1000;
          const ring = 60 + age * 760;
          const band = 190;
          const pd = Math.hypot(p.x - cx, p.y - cy);
          const inBand = Math.max(0, 1 - Math.abs(pd - ring) / band);
          boost = Math.max(boost, inBand * (1 - age / 1.6) * 1.15);
        }

        const v = Math.min(1, intensity * 0.92 + boost);
        const img = root.querySelector("img");
        if (img) (img as HTMLElement).style.opacity = v.toFixed(3);
        if (label)
          label.style.opacity = Math.max(0, Math.min(1, v * 1.5 - 0.3)).toFixed(3);
      });
    });
  }, [subscribe, pointer, reduced]);

  return (
    <Section id="midnight" start={1000} end={4000} className="text-[#e9f1ee]">
      <div ref={outerRef} className="h-[280svh]">
        <div
          ref={stageRef}
          data-cursor="sonar"
          onPointerDown={spawnPing}
          className="sticky top-0 h-[100svh] overflow-hidden"
        >
          {/* faint structural ghost */}
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-black uppercase leading-none tracking-tight text-outline-faint text-[clamp(4rem,15vw,13rem)]"
          >
            BATHYPELAGIC
          </p>

          {/* title */}
          <div className="pointer-events-none absolute left-5 top-24 z-10 max-w-xl md:left-8 md:top-28">
            <ZoneTag numeral="III" name="MIDNIGHT" range="1,000 — 4,000 M" className="w-56 md:w-72" />
            <Lines
              className="display-wide mt-6 font-black uppercase leading-[0.95] tracking-[-0.02em]"
              lineClass="text-[clamp(1.5rem,3.6vw,3rem)]"
              lines={[
                <>LIGHT IS NO</>,
                <>
                  <span className="font-serif font-normal normal-case italic tracking-normal">
                    longer given. It is made.
                  </span>
                </>,
              ]}
            />
          </div>

          {/* ambient light following the pointer */}
          <div
            ref={lightRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-[46rem] w-[46rem] rounded-full opacity-70 mix-blend-screen will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(141,234,255,0.115) 0%, rgba(80,180,215,0.05) 34%, transparent 62%)",
            }}
          />

          {/* the residents */}
          {CREATURES.map((c, i) => (
            <div
              key={c.name}
              ref={(el) => {
                creatureRefs.current[i] = el;
              }}
              className="absolute will-change-transform"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: `max(${c.w}vw, 170px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="pointer-events-none absolute -top-9 left-1/2 w-max max-w-[240px] -translate-x-1/2 text-center opacity-0"
              >
                <p className="font-mono text-[9px] tracking-[0.22em] text-white/90">
                  {c.name} <span className="text-white/40">— {c.depth}</span>
                </p>
                <p className="mt-1 font-mono text-[7px] tracking-[0.22em] text-white/40">
                  {c.meta}
                </p>
              </div>
              <img
                src={c.img}
                alt={c.meta}
                loading="lazy"
                className="w-full opacity-0 mix-blend-screen"
                style={{
                  filter: "drop-shadow(0 0 26px rgba(94,224,255,0.35)) saturate(1.15)",
                }}
                draggable={false}
              />
            </div>
          ))}

          {/* active pings */}
          {pings.map((p) => (
            <span
              key={p.id}
              aria-hidden
              className="ping-ring pointer-events-none absolute rounded-full border border-[#8deaff]/50"
              style={{
                left: p.x,
                top: p.y,
                width: "260vmin",
                height: "260vmin",
              }}
            />
          ))}

          {/* hint */}
          <div className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center">
            <div className="flex items-center gap-4 border border-white/10 bg-black/25 px-4 py-2.5 font-mono text-[8px] tracking-[0.3em] text-white/55 backdrop-blur-sm">
              {fine ? (
                <>
                  <span className="flex items-center gap-2">
                    <Move size={11} aria-hidden /> LIGHT — MOVE
                  </span>
                  <span className="h-2.5 w-px bg-white/20" aria-hidden />
                  <span className="flex items-center gap-2">
                    <MousePointerClick size={11} aria-hidden /> PING — CLICK
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <Hand size={11} aria-hidden /> LIGHT — DRAG
                  </span>
                  <span className="h-2.5 w-px bg-white/20" aria-hidden />
                  <span className="flex items-center gap-2">
                    <Pointer size={11} aria-hidden /> PING — TAP
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
