import { useState, useEffect } from "react";
import { LiveHash } from "./components/LiveHash";
import { AvalancheEffect } from "./components/AvalancheEffect";
import { ConstructionDiagram } from "./components/ConstructionDiagram";
import { SpeedBenchmark } from "./components/SpeedBenchmark";
import { DistributionAnalysis } from "./components/DistributionAnalysis";
import { CollisionDemo } from "./components/CollisionDemo";

type Tab =
    | "live"
    | "avalanche"
    | "construction"
    | "benchmark"
    | "distribution"
    | "collision";

interface TabItem {
    id: Tab;
    label: string;
    icon: string;
    description: string;
}

const TABS: TabItem[] = [
    {
        id: "live",
        label: "Jonli xeshlash",
        icon: "🔤",
        description: "Real vaqtda matnni xesh kodga aylantirish",
    },
    {
        id: "avalanche",
        label: "Avalanche effekti",
        icon: "❄️",
        description: "1 bit o'zgarishi natijani qancha o'zgartiradi",
    },
    {
        id: "construction",
        label: "Qurilish sxemasi",
        icon: "🏗️",
        description: "Merkle-Damgård va Sponge konstruksiyalari",
    },
    {
        id: "benchmark",
        label: "Tezlik benchmarki",
        icon: "⚡",
        description: "Algoritmlarning samaradorligi (MB/s)",
    },
    {
        id: "distribution",
        label: "Taqsimot tahlili",
        icon: "📊",
        description: "Chiqish baytlari bir tekis tarqalganmi",
    },
    {
        id: "collision",
        label: "Kolliziya demosi",
        icon: "💥",
        description: "MD5 zaifligi va SHA-3 mustahkamligi",
    },
];

function App() {
    const [tab, setTab] = useState<Tab>("live");
    const [menuOpen, setMenuOpen] = useState(false);

    const currentTab = TABS.find((t) => t.id === tab)!;

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const handleTabChange = (id: Tab) => {
        setTab(id);
        setMenuOpen(false);
    };

    return (
        <div className="min-h-screen">
            <header className="border-b border-slate-800 bg-bg-surface/80 backdrop-blur sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-accent to-success flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                            🔐
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-sm sm:text-lg font-bold text-white truncate">
                                Xesh Funksiyalar Tahlilchisi
                            </h1>
                            <p className="text-[10px] sm:text-xs text-slate-200 truncate hidden sm:block">
                                Zamonaviy xesh funksiyalarini qurish
                                usullarining tahlili
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-300 hidden lg:block">
                            BMI loyihasi · Azimov Shoxruxbek
                        </div>
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                            aria-label="Menyuni ochish"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                            >
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <nav className="border-b border-slate-800 bg-bg-surface/40 hidden md:block">
                <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                tab === t.id
                                    ? "border-accent text-white"
                                    : "border-transparent text-slate-200 hover:text-white"
                            }`}
                        >
                            <span className="mr-2">{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
            </nav>

            {menuOpen && (
                <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                />
            )}

            <aside
                className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-bg-surface border-l border-slate-800 z-40 transform transition-transform duration-300 md:hidden ${
                    menuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="font-bold text-white">Bo'limlar</div>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                        aria-label="Yopish"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="p-2 overflow-y-auto h-[calc(100vh-64px)]">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => handleTabChange(t.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors flex items-start gap-3 ${
                                tab === t.id
                                    ? "bg-accent/15 text-white border border-accent/40"
                                    : "text-slate-200 hover:bg-bg-elevated"
                            }`}
                        >
                            <span className="text-2xl flex-shrink-0">
                                {t.icon}
                            </span>
                            <div className="min-w-0">
                                <div className="font-semibold">{t.label}</div>
                                <div className="text-xs text-slate-300 mt-0.5">
                                    {t.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        {currentTab.icon} {currentTab.label}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-200">
                        {currentTab.description}
                    </p>
                </div>

                {tab === "live" && <LiveHash />}
                {tab === "avalanche" && <AvalancheEffect />}
                {tab === "construction" && <ConstructionDiagram />}
                {tab === "benchmark" && <SpeedBenchmark />}
                {tab === "distribution" && <DistributionAnalysis />}
                {tab === "collision" && <CollisionDemo />}
            </main>

            <footer className="border-t border-slate-800 mt-16 py-6 text-center text-xs text-slate-300 px-4">
                <p>
                    Toshkent Axborot Texnologiyalari Universiteti ·
                    Kiberxavfsizlik fakulteti · Kriptologiya kafedrasi
                </p>
            </footer>
        </div>
    );
}

export default App;
