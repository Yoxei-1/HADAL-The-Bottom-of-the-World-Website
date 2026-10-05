/* The depth engine: a single rAF loop that maps scroll position to metres
   below sea level, smooths it, and broadcasts frames to every instrument. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type MutableRefObject,
} from "react";

export type FrameFn = (dt: number, t: number) => void;

type Anchor = {
  el: HTMLElement;
  start: number;
  end: number;
  top: number;
  bottom: number;
};

type Pointer = {
  x: MutableRefObject<number>;
  y: MutableRefObject<number>;
  xs: MutableRefObject<number>;
  ys: MutableRefObject<number>;
  active: MutableRefObject<boolean>;
  down: MutableRefObject<boolean>;
};

type EngineApi = {
  depth: MutableRefObject<number>;
  progress: MutableRefObject<number>;
  pointer: Pointer;
  subscribe: (fn: FrameFn) => () => void;
  register: (el: HTMLElement, start: number, end: number) => () => void;
  measure: () => void;
  reduced: boolean;
  fine: boolean;
};

const Ctx = createContext<EngineApi | null>(null);

export function useEngine(): EngineApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("DepthEngine missing");
  return v;
}

export function DepthEngine({ children }: { children: ReactNode }) {
  const depth = useRef(0);
  const progress = useRef(0);
  const px = useRef(0);
  const py = useRef(0);
  const pxs = useRef(0);
  const pys = useRef(0);
  const pActive = useRef(false);
  const pDown = useRef(false);

  const anchors = useRef<Map<HTMLElement, Anchor>>(new Map());
  const sorted = useRef<Anchor[]>([]);
  const subs = useRef<Set<FrameFn>>(new Set());

  const fine = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    []
  );
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const measure = useCallback(() => {
    const y = window.scrollY;
    sorted.current = [...anchors.current.values()]
      .map((a) => {
        const top = a.el.getBoundingClientRect().top + y;
        return { ...a, top, bottom: top + a.el.offsetHeight };
      })
      .sort((a, b) => a.top - b.top);
  }, []);

  const register = useCallback(
    (el: HTMLElement, start: number, end: number) => {
      anchors.current.set(el, { el, start, end, top: 0, bottom: 0 });
      const id = requestAnimationFrame(measure);
      return () => {
        cancelAnimationFrame(id);
        anchors.current.delete(el);
        measure();
      };
    },
    [measure]
  );

  const subscribe = useCallback((fn: FrameFn) => {
    subs.current.add(fn);
    return () => {
      subs.current.delete(fn);
    };
  }, []);

  /* pointer tracking */
  useEffect(() => {
    const move = (e: PointerEvent) => {
      px.current = e.clientX;
      py.current = e.clientY;
      pActive.current = true;
    };
    const down = () => (pDown.current = true);
    const up = () => (pDown.current = false);
    const leave = () => (pActive.current = false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  /* fine-pointer class for cursor hiding */
  useEffect(() => {
    document.documentElement.classList.toggle("fine-pointer", fine);
  }, [fine]);

  /* master loop */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const t = now / 1000;

      const y = window.scrollY;
      const docH = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );

      /* raw depth from section anchors */
      let raw = 0;
      const list = sorted.current;
      if (list.length) {
        if (y <= list[0].top) raw = list[0].start;
        else if (y >= list[list.length - 1].bottom - 1) raw = list[list.length - 1].end;
        else {
          for (const a of list) {
            if (y >= a.top && y < a.bottom) {
              const span = Math.max(1, a.bottom - a.top);
              raw = a.start + (a.end - a.start) * ((y - a.top) / span);
              break;
            }
            if (y >= a.bottom) raw = a.end;
          }
        }
      }

      const k = reduced ? 1 : 1 - Math.exp((-dt / 1000) * 7);
      depth.current += (raw - depth.current) * k;
      if (Math.abs(raw - depth.current) < 0.05) depth.current = raw;

      const rawP = y / docH;
      progress.current += (rawP - progress.current) * k;

      const ks = 1 - Math.exp((-dt / 1000) * 26);
      pxs.current += (px.current - pxs.current) * ks;
      pys.current += (py.current - pys.current) * ks;

      subs.current.forEach((fn) => fn(dt, t));
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    measure();
    const late = window.setTimeout(measure, 1400);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [measure, reduced]);

  const api = useMemo<EngineApi>(
    () => ({
      depth,
      progress,
      pointer: { x: px, y: py, xs: pxs, ys: pys, active: pActive, down: pDown },
      subscribe,
      register,
      measure,
      reduced,
      fine,
    }),
    [subscribe, register, measure, reduced, fine]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
