import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useEngine } from "../core/engine";
import { useSound } from "../audio/engine";
import { scrollToY } from "../lib/scroll";
import { Magnetic } from "./Magnetic";

export function Header({ onMenu }: { onMenu: () => void }) {
  const { depth, subscribe } = useEngine();
  const [sound, setSound] = useSound();
  const mobileDepth = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let last = "";
    return subscribe(() => {
      const el = mobileDepth.current;
      if (!el) return;
      const v = `${Math.round(depth.current).toLocaleString("en-US")} M`;
      if (v !== last) {
        last = v;
        el.textContent = v;
      }
    });
  }, [subscribe, depth]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] mix-blend-difference">
      <div className="flex items-start justify-between p-5 text-white md:p-8">
        {/* wordmark */}
        <div className="pointer-events-auto">
          <Magnetic strength={0.2}>
            <button
              type="button"
              data-cursor="link"
              onClick={() => scrollToY(0, 2200)}
              aria-label="Back to the surface"
              className="block text-left"
            >
              <span className="block text-lg font-black leading-none tracking-tight">
                HADAL
              </span>
              <span className="mt-1.5 block font-mono text-[8px] tracking-[0.3em] opacity-60">
                DESCENT PROGRAM
              </span>
            </button>
          </Magnetic>
        </div>

        {/* live depth — compact screens */}
        <span
          ref={mobileDepth}
          className="tnum pt-1 font-mono text-[10px] tracking-[0.2em] opacity-70 lg:hidden"
        >
          0 M
        </span>

        {/* controls */}
        <div className="pointer-events-auto flex items-center gap-6 md:gap-9">
          <Magnetic strength={0.25}>
            <button
              type="button"
              data-cursor="link"
              onClick={() => setSound(!sound)}
              aria-pressed={sound}
              aria-label={sound ? "Mute sound" : "Enable sound"}
              className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] opacity-80 transition-opacity hover:opacity-100"
            >
              {sound ? (
                <span className="eq" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
              ) : null}
              {sound ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span className="hidden sm:inline">SOUND</span>
            </button>
          </Magnetic>

          <Magnetic strength={0.25}>
            <button
              type="button"
              data-cursor="link"
              onClick={onMenu}
              aria-label="Open navigation"
              className="group flex items-center gap-2.5 font-mono text-[9px] tracking-[0.3em] opacity-80 transition-opacity hover:opacity-100"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <span className="h-px w-5 bg-current transition-transform duration-300 group-hover:scale-x-50" />
                <span className="h-px w-5 bg-current" />
              </span>
              MENU
            </button>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
