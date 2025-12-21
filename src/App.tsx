import { useRef, useState, useEffect, useCallback } from "react";
import type React from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminPanel } from "./components/admin/AdminPanel";
import { MonteVerdeHero } from "./components/MonteVerdeHero";
import { MonteVerdeExperiencias } from "./components/MonteVerdeExperiencias";
import { HotelNinhoFalcao } from "./components/HotelNinhoFalcao";
import { VooIda } from "./components/VooIda";
import { TransferIda } from "./components/TransferIda";
import { TransferVolta } from "./components/TransferVolta";
import { VooVolta } from "./components/VooVolta";
import { OrcamentoFinal } from "./components/OrcamentoFinal";
import { TesteExtracao } from "./components/TesteExtracao";
import { TesteCotacaoIsolado } from "./pages/TesteCotacaoIsolado";
import type { Snapshot, CotacaoData, Cotacao } from "./types/cotacao";
import { hasItem } from "./types/cotacao";

function getSlugFromUrl(): string | null {
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

async function logEvent(payload: {
  slug: string;
  type: "open" | "screen_view" | "time_spent";
  screen?: number;
  duration_ms?: number;
}) {
  try {
    await supabase.from("cotacao_events").insert({
      slug: payload.slug,
      type: payload.type,
      screen: payload.screen ?? null,
      duration_ms: payload.duration_ms ?? null
    });
  } catch {
    // falha silenciosa (analytics não pode quebrar a UX)
  }
}

const CONFIG = {
  OVERSCROLL_THRESHOLD: 80,
  MAX_OVERSCROLL_TIME: 400
};

function converterParaNovoSnapshot(cotacao: any): Snapshot {
  const snapshotAntigo = cotacao?.snapshot || {};

  if (snapshotAntigo.version === "1.0") {
    return snapshotAntigo as Snapshot;
  }

  const novoSnapshot: Snapshot = {
    version: "1.0",

    meta: {
      destino_nome: cotacao?.destino_nome || snapshotAntigo?.destino_nome || "Destino",
      destino_estado: cotacao?.destino_estado || snapshotAntigo?.destino_estado || "",
      destino_pais: snapshotAntigo?.destino_pais || "Brasil",
      destino_imagem: cotacao?.destino_imagem || snapshotAntigo?.destino_imagem || "",
      tagline: snapshotAntigo?.tagline || "Preparamos uma experiência pensada em cada detalhe.",
      duracao: snapshotAntigo?.duracao || "",
      data_inicio: snapshotAntigo?.data_inicio || "",
      data_fim: snapshotAntigo?.data_fim || "",
      moeda: snapshotAntigo?.moeda || "BRL"
    },

    cliente: {
      nome: snapshotAntigo?.cliente_nome || cotacao?.cliente_nome || "Viajante",
      email: snapshotAntigo?.cliente_email || cotacao?.cliente_email || ""
    },

    financeiro: {
      valor_total: snapshotAntigo?.valor_total ?? cotacao?.valor_total ?? 0,
      parcelamento: snapshotAntigo?.parcelamento || cotacao?.parcelamento || "em até 10x sem juros",
      observacoes: snapshotAntigo?.observacoes_financeiras || ""
    },

    itens: snapshotAntigo?.itens || [],
    experiencias: snapshotAntigo?.experiencias || []
  };

  return novoSnapshot;
}

function MainApp() {
  const slug = getSlugFromUrl();

  const path = window.location.pathname;
  const isAdmin = path.endsWith("/admin") || path.includes("/admin");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const [cotacao, setCotacao] = useState<Cotacao | null>(null);
  const [loadingCotacao, setLoadingCotacao] = useState(true);
  const [cotacaoInexistente, setCotacaoInexistente] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!slug) return;

    async function carregarCotacao() {
      setLoadingCotacao(true);

      const { data, error } = await supabase
        .from("cotacoes")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        setCotacaoInexistente(true);
        setCotacao(null);
      } else {
        setCotacao(data as Cotacao);
        setCotacaoInexistente(false);
        logEvent({ slug, type: "open" });
      }

      setLoadingCotacao(false);
    }

    carregarCotacao();
  }, [slug, user]);

  const [currentScreen, setCurrentScreen] = useState(0);

  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const wasAtEdgeOnStartRef = useRef<"top" | "bottom" | null>(null);
  const hasNavigatedRef = useRef(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const totalScreensRef = useRef<number>(8);

  const screenEnterAtRef = useRef<number>(Date.now());
  const lastScreenRef = useRef<number>(0);

  const handleNext = useCallback(() => {
    setCurrentScreen((prev) => Math.min(prev + 1, totalScreensRef.current - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentScreen((prev) => Math.max(prev - 1, 0));
  }, []);

  const getScrollableElement = useCallback((target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof HTMLElement)) return null;
    return target.closest('[data-scrollable="true"]') as HTMLElement | null;
  }, []);

  const getEdgeState = useCallback((el: HTMLElement | null) => {
    if (!el) return { atTop: true, atBottom: true };

    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    return { atTop, atBottom };
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartYRef.current = touch.clientY;
      touchStartTimeRef.current = Date.now();
      hasNavigatedRef.current = false;

      const scrollEl = getScrollableElement(e.target);
      scrollContainerRef.current = scrollEl;

      const { atTop, atBottom } = getEdgeState(scrollEl);

      if (atTop && atBottom) {
        wasAtEdgeOnStartRef.current = "bottom";
      } else if (atTop) {
        wasAtEdgeOnStartRef.current = "top";
      } else if (atBottom) {
        wasAtEdgeOnStartRef.current = "bottom";
      } else {
        wasAtEdgeOnStartRef.current = null;
      }
    },
    [getScrollableElement, getEdgeState]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (hasNavigatedRef.current) return;

      const touch = e.touches[0];
      const startY = touchStartYRef.current;
      const startTime = touchStartTimeRef.current;
      const edgeOnStart = wasAtEdgeOnStartRef.current;
      const scrollEl = scrollContainerRef.current;

      if (startY === null || startTime === null) return;

      const deltaY = startY - touch.clientY;
      const elapsed = Date.now() - startTime;
      const { atTop, atBottom } = getEdgeState(scrollEl);

      if (atTop && atBottom) {
        if (deltaY > 0) {
          if (deltaY >= CONFIG.OVERSCROLL_THRESHOLD && elapsed <= CONFIG.MAX_OVERSCROLL_TIME) {
            hasNavigatedRef.current = true;
            handleNext();
          }
        }
        if (deltaY < 0) {
          if (
            Math.abs(deltaY) >= CONFIG.OVERSCROLL_THRESHOLD &&
            elapsed <= CONFIG.MAX_OVERSCROLL_TIME
          ) {
            hasNavigatedRef.current = true;
            handlePrev();
          }
        }
        return;
      }

      if (edgeOnStart === "bottom" && atBottom && deltaY > 0) {
        if (deltaY >= CONFIG.OVERSCROLL_THRESHOLD && elapsed <= CONFIG.MAX_OVERSCROLL_TIME) {
          hasNavigatedRef.current = true;
          handleNext();
        }
      }

      if (edgeOnStart === "top" && atTop && deltaY < 0) {
        if (
          Math.abs(deltaY) >= CONFIG.OVERSCROLL_THRESHOLD &&
          elapsed <= CONFIG.MAX_OVERSCROLL_TIME
        ) {
          hasNavigatedRef.current = true;
          handlePrev();
        }
      }
    },
    [getEdgeState, handleNext, handlePrev]
  );

  const handleTouchEnd = useCallback(() => {
    touchStartYRef.current = null;
    touchStartTimeRef.current = null;
    wasAtEdgeOnStartRef.current = null;
    scrollContainerRef.current = null;
  }, []);

  useEffect(() => {
    const now = Date.now();
    const duration = now - screenEnterAtRef.current;

    if (slug && lastScreenRef.current !== currentScreen) {
      logEvent({
        slug,
        type: "time_spent",
        screen: lastScreenRef.current,
        duration_ms: duration
      });

      logEvent({
        slug,
        type: "screen_view",
        screen: currentScreen
      });
    }

    lastScreenRef.current = currentScreen;
    screenEnterAtRef.current = now;
  }, [currentScreen, slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const scrollEl = document.querySelector('[data-scrollable="true"]') as HTMLElement;
      if (scrollEl) {
        scrollEl.scrollTop = 0;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <button
          className="px-6 py-3 bg-black text-white rounded"
          onClick={async () => {
            const email = prompt("Email");
            const password = prompt("Senha");

            if (!email || !password) return;

            const { error } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            if (error) alert(error.message);
            else location.reload();
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminPanel user={user} supabase={supabase} />;
  }

  if (loadingCotacao) {
    return <div className="h-screen flex items-center justify-center">Carregando cotação…</div>;
  }

  if (cotacaoInexistente || !cotacao) {
    return <div className="h-screen flex items-center justify-center">Cotação não encontrada</div>;
  }

  const expiresAt = cotacao?.expires_at ? new Date(cotacao.expires_at) : null;
  const isExpired = expiresAt ? expiresAt.getTime() < Date.now() : false;

  if (isExpired) {
    return <div className="h-screen flex items-center justify-center">Cotação expirada</div>;
  }

  const snapshot = converterParaNovoSnapshot(cotacao);

  const cotacaoData: CotacaoData = {
    snapshot,
    cotacao
  };

  const screens: React.ReactNode[] = [];

  screens.push(<MonteVerdeHero key="hero" cotacaoData={cotacaoData} onNext={handleNext} />);

  screens.push(
    <MonteVerdeExperiencias
      key="experiencias"
      cotacaoData={cotacaoData}
      onNext={handleNext}
      onPrev={handlePrev}
    />
  );

  if (hasItem(snapshot, "voo", "ida")) {
    screens.push(
      <VooIda key="voo-ida" cotacaoData={cotacaoData} onNext={handleNext} onPrev={handlePrev} />
    );
  }

  if (hasItem(snapshot, "transfer", "ida")) {
    screens.push(
      <TransferIda
        key="transfer-ida"
        cotacaoData={cotacaoData}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    );
  }

  if (hasItem(snapshot, "hotel")) {
    screens.push(
      <HotelNinhoFalcao
        key="hotel"
        cotacaoData={cotacaoData}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    );
  }

  if (hasItem(snapshot, "transfer", "volta")) {
    screens.push(
      <TransferVolta
        key="transfer-volta"
        cotacaoData={cotacaoData}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    );
  }

  if (hasItem(snapshot, "voo", "volta")) {
    screens.push(
      <VooVolta key="voo-volta" cotacaoData={cotacaoData} onNext={handleNext} onPrev={handlePrev} />
    );
  }

  screens.push(<OrcamentoFinal key="orcamento" cotacaoData={cotacaoData} onPrev={handlePrev} />);

  totalScreensRef.current = screens.length;

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {screens[currentScreen]}

      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs z-50">
        {currentScreen + 1}/{screens.length}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/teste-cotacao-isolado"
          element={<TesteCotacaoIsolado supabase={supabase} />}
        />
        <Route path="/teste" element={<TesteExtracao />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}
