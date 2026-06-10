import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { ALL_ALGORITHMS, HASH_INFO, computeHashBytes } from "../lib/hashes";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

interface Result {
    algo: string;
    mbps: number;
    color: string;
}

export function SpeedBenchmark() {
    const [results, setResults] = useState<Result[]>([]);
    const [running, setRunning] = useState(false);
    const [size, setSize] = useState(100); // KB
    const [progress, setProgress] = useState(0);

    const runBenchmark = async () => {
        setRunning(true);
        setResults([]);
        setProgress(0);

        const data = "a".repeat(size * 1024);
        const newResults: Result[] = [];

        for (let i = 0; i < ALL_ALGORITHMS.length; i++) {
            const algo = ALL_ALGORITHMS[i];
            const info = HASH_INFO[algo];

            const start = performance.now();
            const iterations = 50;
            for (let j = 0; j < iterations; j++) {
                computeHashBytes(algo, data);
            }
            const elapsed = (performance.now() - start) / 1000;
            const totalMB = (size * iterations) / 1024;
            const mbps = totalMB / elapsed;

            newResults.push({ algo, mbps, color: info.color });
            setProgress(((i + 1) / ALL_ALGORITHMS.length) * 100);
            setResults([...newResults]);

            await new Promise((r) => setTimeout(r, 50));
        }

        setRunning(false);
    };

    const sorted = [...results].sort((a, b) => b.mbps - a.mbps);

    const chartData = {
        labels: sorted.map((r) => r.algo),
        datasets: [
            {
                label: "MB/s",
                data: sorted.map((r) => r.mbps),
                backgroundColor: sorted.map((r) => r.color),
                borderRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: any) => `${ctx.parsed.y.toFixed(1)} MB/s`,
                },
            },
        },
        scales: {
            y: {
                ticks: { color: "#94a3b8" },
                grid: { color: "rgba(148, 163, 184, 0.1)" },
                title: {
                    display: true,
                    text: "MB/s",
                    color: "#cbd5e1",
                },
            },
            x: {
                ticks: { color: "#94a3b8" },
                grid: { display: false },
            },
        },
    };

    return (
        <div className="space-y-6">
            <div className="card-elevated">
                <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
                    <div className="md:w-1/3">
                        <label className="block text-sm font-medium text-slate-100 mb-2">
                            Ma'lumot hajmi (KB)
                        </label>
                        <input
                            type="number"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            min={10}
                            max={10000}
                            disabled={running}
                            className="input-base font-mono h-11"
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="block text-sm font-medium text-slate-100 mb-2 invisible">
                            .
                        </label>
                        <button
                            onClick={runBenchmark}
                            disabled={running}
                            className="btn-primary w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {running
                                ? `Hisoblanmoqda... ${progress.toFixed(0)}%`
                                : "🚀 Benchmark boshlash"}
                        </button>
                    </div>
                </div>
                <div className="text-xs text-slate-300 mt-2">
                    10 - 10000 KB orasida qiymat kiriting
                </div>
                {running && (
                    <div className="mt-4 h-2 bg-bg rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-accent to-success transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {results.length > 0 && (
                <>
                    <div className="card-elevated" style={{ height: "400px" }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        {sorted.map((r, idx) => (
                            <div
                                key={r.algo}
                                className="card flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-xl">
                                        {idx === 0
                                            ? "🥇"
                                            : idx === 1
                                              ? "🥈"
                                              : idx === 2
                                                ? "🥉"
                                                : `${idx + 1}.`}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">
                                            {r.algo}
                                        </div>
                                        <div className="text-xs text-slate-300">
                                            {HASH_INFO[r.algo as keyof typeof HASH_INFO]
                                                .construction}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-mono font-bold" style={{ color: r.color }}>
                                        {r.mbps.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-slate-300">MB/s</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="card border-l-4 border-l-warning">
                <h3 className="font-bold text-white mb-2">📝 Eslatma</h3>
                <p className="text-sm text-slate-100 leading-relaxed">
                    Tezlik brauzeringizning JavaScript dvigatelida o'lchanadi —
                    bu native C/Rust implementatsiyasidan sekinroq, lekin
                    nisbiy taqqoslash uchun yaxshi. Real natijalar uchun{" "}
                    <code>openssl speed</code> kabi vositalar ishlatiladi.
                </p>
            </div>
        </div>
    );
}
