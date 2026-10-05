import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { NAV_ITEMS, COORDS } from "../data/zones";
import { scrollToSection } from "../lib/scroll";
import { cn } from "../utils/cn";

export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = window.setTimeout(() => setRendered(false), 750);
    return () => clearTimeout(t);
  }, [open]);

  /* scroll lock + escape */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", esc);
    };
  }, [open, onClose]);

  if (!rendered) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Expedition navigation"
      className="fixed inset-0 z-[90] bg-[#010409]"
      style={{
        clipPath: visible ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 750ms cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      {/* top bar */}
      <div className="flex items-start justify-between p-5 md:p-8">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/50">
          DIVE PLAN — SIX FIXES
        </span>
        <button
          type="button"
          data-cursor="link"
          onClick={onClose}
          aria-label="Close navigation"
          className="group flex items-center gap-2.5 font-mono text-[9px] tracking-[0.3em] text-white/80 transition-opacity hover:opacity-70"
        >
          CLOSE
          <span className="relative block h-3 w-3" aria-hidden>
            <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      {/* zones */}
      <nav className="mt-2 px-5 md:mt-6 md:px-8">
        {NAV_ITEMS.map((item, i) => (
          <div
            key={item.id}
            className="overflow-hidden border-t border-white/10 last:border-b"
            style={{
              transform: visible ? "translateY(0)" : "translateY(3.2rem)",
              opacity: visible ? 1 : 0,
              transition: `transform 800ms cubic-bezier(0.22,1,0.36,1) ${180 + i * 65}ms, opacity 600ms ease ${180 + i * 65}ms`,
            }}
          >
            <button
              type="button"
              data-cursor="link"
              onClick={() => {
                onClose();
                window.setTimeout(() => scrollToSection(item.id, 1700), 150);
              }}
              className={cn(
                "group flex w-full items-baseline justify-between gap-4 py-3 text-left md:py-4"
              )}
            >
              <span className="flex items-baseline gap-4 md:gap-8">
                <span className="w-8 font-mono text-[9px] tracking-[0.25em] text-white/40">
                  {item.numeral}
                </span>
                <span className="roll text-[clamp(1.9rem,6.5vw,4.2rem)] font-black uppercase leading-[1.05] tracking-tight text-white">
                  <span>{item.label}</span>
                  <span className="font-serif italic normal-case tracking-normal text-[#8deaff]">
                    {item.label.toLowerCase()}
                  </span>
                </span>
                <ArrowUpRight
                  className="hidden -translate-x-2 self-center text-white/0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[#8deaff] md:block"
                  size={26}
                  aria-hidden
                />
              </span>
              <span className="tnum font-mono text-[10px] tracking-[0.2em] text-white/45 md:text-xs">
                {item.depth}
              </span>
            </button>
          </div>
        ))}
      </nav>

      {/* footer */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 font-mono text-[9px] tracking-[0.25em] text-white/40 md:flex-row md:items-end md:justify-between md:p-8">
        <span>{COORDS}</span>
        <span>SOUND RECOMMENDED — LOW AND SLOW</span>
      </div>
    </div>
  );
}
