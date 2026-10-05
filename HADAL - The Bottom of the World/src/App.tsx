import { useCallback, useEffect, useState } from "react";
import { DepthEngine } from "./core/engine";
import { Preloader } from "./components/Preloader";
import { Backdrop } from "./components/Backdrop";
import { MarineSnow } from "./components/MarineSnow";
import { Grain } from "./components/Grain";
import { Cursor } from "./components/Cursor";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { DepthGauge } from "./components/DepthGauge";
import { Telemetry } from "./components/Telemetry";
import { Surface } from "./sections/Surface";
import { Sunlight } from "./sections/Sunlight";
import { Twilight } from "./sections/Twilight";
import { Midnight } from "./sections/Midnight";
import { Abyss } from "./sections/Abyss";
import { Hadal } from "./sections/Hadal";
import { Signal } from "./sections/Signal";
import { Footer } from "./sections/Footer";

export default function App() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /* lock scroll during the pre-dive checks */
  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <DepthEngine>
      <Preloader onReady={() => setReady(true)} />

      <Backdrop />
      <MarineSnow />
      <Grain />
      <Cursor />

      <Header onMenu={() => setMenuOpen(true)} />
      <Menu open={menuOpen} onClose={closeMenu} />
      <DepthGauge />
      <Telemetry />

      <main className="relative z-10">
        <Surface started={ready} />
        <Sunlight />
        <Twilight />
        <Midnight />
        <Abyss />
        <Hadal />
        <Signal />
        <Footer />
      </main>
    </DepthEngine>
  );
}
